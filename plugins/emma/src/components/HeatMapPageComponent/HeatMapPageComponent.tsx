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
  return <Page themeId="tool">
          <Header title="Welcome to emma heatmap!">
            <HeaderLabel label="Owner" value="Team X" />
            <HeaderLabel label="Lifecycle" value="Alpha" />
          </Header>
          <Content>
            <ContentHeader title="VM cost by data center location">
              <SupportButton>A description of your plugin goes here.</SupportButton>
            </ContentHeader>
            <HeatMapComponent />
          </Content>
         </Page>;
};
