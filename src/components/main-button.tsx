import React, { type FC } from 'react';
import { httpClient } from '@wix/essentials';
import { dashboard } from '@wix/dashboard';
import { Button } from '@wix/design-system';
import { GetStarted } from '@wix/wix-ui-icons-common';
import { id as PLUGIN_ID } from '../site/plugins/custom-elements/carbon-offset/plugin.json';
import type { Settings } from '../types';
import '@wix/design-system/styles.global.css';

const WIX_ECOMMERCE_APP_ID = '1380b703-ce81-ff05-f115-39571d94dfcd';
const CHECKOUT_PAGE_ID = '14fd5970-8072-c276-1246-058b79e70c1a';

export const MainButton: FC<Settings> = (settings) => {
  return (
    <Button
      onClick={async () => {
        try {
          // Calling REST API due to lacking SDK
          const placementResponse = await httpClient.fetchWithAuth('https://www.wixapis.com/app-plugins/v1/site-plugins/placement-status');
          const { placementStatuses } = await placementResponse.json();
          const pluginExists = placementStatuses.find((el: any) => el.pluginId === PLUGIN_ID);

          // Known Issue: seems like "placedInSlot" always returns as false
          // During development change the boolean in this if statement manually
          // in order to make the add plugin modal open if needed
          if (!pluginExists.placedInSlot) {
            await dashboard.addSitePlugin(PLUGIN_ID, {
              placement: {
                appDefinitionId: WIX_ECOMMERCE_APP_ID,
                widgetId: CHECKOUT_PAGE_ID,
                slotId: 'checkout:summary:totalsBreakdown:before',
              }
            });

            dashboard.showToast({
              message: 'Plugin Added Successfully',
              type: 'success',
            });
          };
        } catch (error) {
          dashboard.showToast({
            message: 'Failed to Add Plugin',
            type: 'error',
          });
        };

        try {
          await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`, {
            method: 'POST',
            body: JSON.stringify(settings),
          });

          dashboard.showToast({
            message: 'Settings Updated Successfully',
            type: 'success',
          });
        } catch (error) {
          dashboard.showToast({
            message: 'Failed to Update Settings',
            type: 'error',
          });
        };
      }}
    >
      Save
    </Button>
  );
};
