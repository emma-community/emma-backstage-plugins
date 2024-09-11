import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { HeatMapComponent } from '../HeatMapComponent';

export const HeatMapPageComponent = () => {
  return ( 
    <Page themeId="tool">
      <Header title="Welcome to the emma heatmap page!">
        <HeaderLabel label="Owner" value="emma.ms" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Compute config cost by data center location">
          <SupportButton>Visual overview of compute config worldwide.</SupportButton>
        </ContentHeader>
        <HeatMapComponent />
      </Content>
    </Page>
  );
};
