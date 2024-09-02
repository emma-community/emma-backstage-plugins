import { Config } from '@backstage/config';
import { LoggerService  } from '@backstage/backend-plugin-api';
import { EmmaApi, EmmaApiFactory, EmmaDataCenter, GeoFence, GeoLocation } from '@internal/backstage-plugin-emma-common';
import { HttpBearerAuth, Token, DataCentersApi, AuthenticationApi } from '@zaradarbh/emma-typescript-sdk';
import fs from 'fs';
import path from 'path';

/** @public */
export class EmmaApiImpl implements EmmaApi {
    private readonly logger: LoggerService;
    private readonly config: Config;
    private readonly authHandler: HttpBearerAuth = new HttpBearerAuth();
    private readonly apiFactory: EmmaApiFactory;
    private readonly knownGeoLocations: EmmaDataCenter[];
  
    private constructor(
      config: Config,
      logger: LoggerService
    ) {
      this.logger = logger;
      this.config = config;
      this.apiFactory = new EmmaApiFactory(this.authHandler);
      this.knownGeoLocations = this.loadKnownGeoLocations();

      this.issueToken().then((token) => {
        if(token.accessToken !== undefined) 
          this.authHandler.accessToken = token.accessToken;
      });
    }

    static fromConfig(
      config: Config,
      options: { logger: LoggerService },
    ) {
      return new EmmaApiImpl(
        config,
        options.logger
      );
    }

    private loadKnownGeoLocations(): EmmaDataCenter[] {
      const filePath = path.resolve(__dirname, 'knownGeoLocations.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }

    private async issueToken(): Promise<Token> {
      const api = this.apiFactory.create(AuthenticationApi);
      const token = await api.issueToken({ clientId: this.config.getString('emma.clientId'), clientSecret: this.config.getString('emma.clientSecret') });

      return token.body;
    }

    public async getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]> 
    {
      const api = this.apiFactory.create(DataCentersApi);
      let mapped: EmmaDataCenter[] = [];
      
      this.logger.info('Fetching data centers');

      let remoteResults = await api.getDataCenters();

      remoteResults.body.forEach(dataCenter => {
          let matchingEmmaDataCenter = this.knownGeoLocations.find(emmaDC => dataCenter.id?.indexOf(emmaDC.region_code) !== -1);
  
          if(matchingEmmaDataCenter)
            mapped.push(matchingEmmaDataCenter);
      });

      if(geoFence) {        
        this.logger.info('Filtering data centers based on bounds', geoFence);

        mapped = mapped.filter(result => this.isWithinBounds(result.location, geoFence));
      }

      this.logger.info('Returning filtered data centers');

      return mapped;
    }

    private isWithinBounds(location: GeoLocation, geoFence: GeoFence): boolean {
        return geoFence.bottomLeft.latitude <= location.latitude && 
                location.latitude <= geoFence.topRight.latitude && 
                geoFence.bottomLeft.longitude <= location.longitude && 
                location.longitude <= geoFence.topRight.longitude;
    }
}