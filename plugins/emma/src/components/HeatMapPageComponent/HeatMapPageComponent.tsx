import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { useLocation } from 'react-router-dom';
import { HeatMapComponent } from '../HeatMapComponent';

export const HeatMapPageComponent = () => {
  const query = new URLSearchParams(useLocation().search);
  const width = query.get('width') ?? undefined;
  const height = query.get('height') ?? undefined;
  const zoom = query.get('zoom') ? parseInt(query.get('zoom')!, 10) : undefined;
  const minZoom = query.get('minZoom') ? parseInt(query.get('minZoom')!, 10) : undefined;
  const maxZoom = query.get('maxZoom') ? parseInt(query.get('maxZoom')!, 10) : undefined;
  const scrollWheelZoom = query.get('scrollWheelZoom') ? query.get('scrollWheelZoom')!.toLocaleLowerCase() === 'true' : undefined;
  const providers = query.get('providers') ? query.get('providers')?.split(",") : undefined;

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
        <HeatMapComponent width={width} height={height} zoom={zoom} minZoom={minZoom} maxZoom={maxZoom} scrollWheelZoom={scrollWheelZoom} defaultProviders={providers} />
      </Content>
    </Page>
  );
};
