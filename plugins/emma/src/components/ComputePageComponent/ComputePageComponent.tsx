import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ComputeGridComponent } from '../ComputeComponent';

export const ComputePageComponent = () => {
  return ( 
    <Page themeId="tool">
      <Header title="Welcome to the emma compute page!">
        <HeaderLabel label="Owner" value="emma.ms" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Compute entity management by provider">
          <SupportButton>Manage your emma compute entities.</SupportButton>
        </ContentHeader>
        <ComputeGridComponent />
      </Content>
    </Page>
  );
};
