import { PropsWithChildren } from 'react';

import { StyleProvider } from '@ant-design/cssinjs';
import { App, ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';

import dayjs from 'dayjs';
import ptBr from 'dayjs/locale/pt-br';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { useStoreTheme } from '@/store/theme';
import antdTheme from '@/theme/antd';

dayjs.locale(ptBr);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Sao_Paulo');

const validateMessages = {
  required: 'O campo é obrigatório'
};

const AntdProvider = ({ children }: PropsWithChildren) => {
  const isDark = useStoreTheme(state => state.isDark);

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={antdTheme(isDark)}
        locale={ptBR}
        componentSize='middle'
        form={{
          requiredMark: false,
          validateMessages
        }}
      >
        <App message={{ duration: 5, maxCount: 3 }}>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default AntdProvider;
