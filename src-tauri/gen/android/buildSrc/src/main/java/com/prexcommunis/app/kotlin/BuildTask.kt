import java.io.File
import javax.inject.Inject
import org.apache.tools.ant.taskdefs.condition.Os
import org.gradle.api.DefaultTask
import org.gradle.api.GradleException
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.TaskAction
import org.gradle.process.ExecOperations

abstract class BuildTask : DefaultTask() {
    @get:Inject
    protected abstract val execOperations: ExecOperations

    @Input
    var rootDirRel: String? = null
    @Input
    var target: String? = null
    @Input
    var release: Boolean? = null

    @TaskAction
    fun assemble() {
        val rootDirRel = rootDirRel ?: throw GradleException("rootDirRel cannot be null")
        val workingDir = File(project.projectDir, rootDirRel)
        
        // Find the NDK to use cargo directly
        val ndkDir = try {
            val android = project.extensions.findByName("android")
            if (android != null) {
                val getNdkDirectory = android.javaClass.getMethod("getNdkDirectory")
                getNdkDirectory.invoke(android) as? File
            } else null
        } catch (e: Exception) {
            null
        } ?: File(System.getenv("ANDROID_NDK_HOME") ?: "")

        if (ndkDir == null || !ndkDir.exists()) {
            project.logger.warn("NDK not found. Falling back to Tauri CLI...")
            runTauriCliFallback(workingDir)
            return
        }

        val tTarget = target ?: "aarch64"
        val (cargoTarget, toolchainPrefix, abiFolder) = when (tTarget) {
            "aarch64" -> Triple("aarch64-linux-android", "aarch64-linux-android", "arm64-v8a")
            "arm" -> Triple("armv7-linux-androideabi", "armv7-linux-androideabi", "armeabi-v7a")
            "armv7" -> Triple("armv7-linux-androideabi", "armv7-linux-androideabi", "armeabi-v7a")
            "x86" -> Triple("i686-linux-android", "i686-linux-android", "x86")
            "x86_64" -> Triple("x86_64-linux-android", "x86_64-linux-android", "x86_64")
            else -> Triple(tTarget, tTarget, tTarget)
        }

        val osName = if (Os.isFamily(Os.FAMILY_WINDOWS)) "windows-x86_64" else "linux-x86_64"
        val toolchainPath = File(ndkDir, "toolchains/llvm/prebuilt/$osName/bin")
        val linkerSuffix = if (Os.isFamily(Os.FAMILY_WINDOWS)) ".cmd" else ""
        
        // Use API level 24 as per build.gradle.kts
        val linkerPrefix = if (tTarget == "arm" || tTarget == "armv7") "armv7a-linux-androideabi24" else "${toolchainPrefix}24"
        val linker = File(toolchainPath, "${linkerPrefix}-clang$linkerSuffix")

        if (!linker.exists()) {
            project.logger.warn("Linker not found at ${linker.absolutePath}. Falling back to Tauri CLI...")
            runTauriCliFallback(workingDir)
            return
        }

        project.logger.lifecycle("Building Rust library for target $cargoTarget using NDK linker...")

        execOperations.exec {
            workingDir(workingDir)
            executable("cargo")
            args("build")
            if (release == true) {
                args("--release")
            }
            args("--target", cargoTarget)
            
            environment("CARGO_TARGET_${cargoTarget.uppercase().replace("-", "_")}_LINKER", linker.absolutePath)
            environment("TAURI_PLATFORM", "android")
            environment("TAURI_ARCH", tTarget)
            environment("TAURI_FAMILY", "unix")
            environment("TAURI_ENV_RELEASE", "true")
        }.assertNormalExitValue()

        // Copy the built library to the jniLibs directory
        val profile = if (release == true) "release" else "debug"
        val builtLib = File(workingDir, "target/$cargoTarget/$profile/libapp_lib.so")
        val destDir = File(project.projectDir, "src/main/jniLibs/$abiFolder")
        destDir.mkdirs()
        val destLib = File(destDir, "libapp_lib.so")
        
        if (builtLib.exists()) {
            project.logger.lifecycle("Copying ${builtLib.absolutePath} to ${destLib.absolutePath}")
            builtLib.copyTo(destLib, overwrite = true)
        } else {
            throw GradleException("Built library not found at ${builtLib.absolutePath}")
        }
    }

    private fun runTauriCliFallback(workingDir: File) {
        val attempts = listOf(listOf("npx", "tauri"), listOf("bunx", "tauri"))
        for (attempt in attempts) {
            try {
                execOperations.exec {
                    workingDir(workingDir)
                    executable(attempt[0])
                    args(attempt.drop(1) + listOf("android", "android-studio-script", "--target", target ?: "aarch64"))
                    if (release == true) args("--release")
                    environment("TAURI_ANDROID_DEV_ADDR", "")
                }.assertNormalExitValue()
                return
            } catch (unused: Exception) {}
        }
    }
}
