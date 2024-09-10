import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { VmConfigurationGridComponent } from '../VmConfigurationComponent';

export const VmConfigurationPageComponent = () => {
  return ( 
    <Page themeId="tool">
      <Header title="Welcome to VMConfiguration page!">
        <HeaderLabel label="Owner" value="emma.ms" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="VMConfiguration Management">
          <SupportButton>Management page for VMConfiguration entities.</SupportButton>
        </ContentHeader>
        <VmConfigurationGridComponent />
      </Content>
    </Page>
  );
};
