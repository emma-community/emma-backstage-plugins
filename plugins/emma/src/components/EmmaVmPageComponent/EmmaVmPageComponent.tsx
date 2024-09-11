import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { EmmaVmGridComponent } from '../EmmaVmComponent';

export const EmmaVmPageComponent = () => {
  return ( 
    <Page themeId="tool">
      <Header title="Welcome to compute entities page!">
        <HeaderLabel label="Owner" value="emma.ms" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Compute Entities">
          <SupportButton>Management page for emma compute entities.</SupportButton>
        </ContentHeader>
        <EmmaVmGridComponent />
      </Content>
    </Page>
  );
};
