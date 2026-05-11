import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

import AntdProvider from './Antd';

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AntdProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AntdProvider>
  );
};

export default Providers;
