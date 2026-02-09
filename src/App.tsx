import React from 'react';
import Layout from './components/Layout/Layout';
import OfficeView from './components/Office/OfficeView';

const App: React.FC = () => {
  return (
    <Layout>
      <OfficeView />
    </Layout>
  );
};

export default App;
