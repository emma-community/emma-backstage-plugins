import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { VmConfigurationManagementComponent } from '../VmConfigurationManagementComponent';

export const VmConfigurationManagementPageComponent = () => {
  return ( 
    <Page themeId="tool">
      <Header title="Welcome to VMConfiguration management page!">
        <HeaderLabel label="Owner" value="emma.ms" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="VMConfiguration Management">
          <SupportButton>Management page for VMConfiguration entities.</SupportButton>
        </ContentHeader>
        <VmConfigurationManagementComponent />
      </Content>
    </Page>
  );
};
