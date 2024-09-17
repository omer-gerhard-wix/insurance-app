import React, { type FC } from 'react';
import { httpClient } from '@wix/essentials';
import { LeafIcon } from './leaf-icon';
import type { Settings } from '../types'

type Props = {
  settings: Settings;
  purchaseFlowId?: string;
  checkoutId?: string;
  checked?: boolean;
  refreshCheckout?: () => void;
};

export const InsuranceSlot: FC<Props> = ({
  settings,
  purchaseFlowId,
  checkoutId,
  checked = false,
  refreshCheckout,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <input
          type='checkbox'
          defaultChecked={checked}
          onChange={async (e) => {
            // We are using the same component both for rendering on site and for previewing in dashboard
            // so we make sure it does not do anything when changing / clicking things in preview
            if (purchaseFlowId) {
              await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/checkout`, {
                method: 'POST',
                body: JSON.stringify({
                  purchaseFlowId,
                  shouldInsure: e.target.checked,
                }),
              });

              // Known Issue: Refresh Checkout is not yet implemented in Custom Element plugins (Wix CLI)
              // to workaround it after using the plugin in the site - go out of the checkout and back again
              // in order for it to reload and call the relevant SPIs with you updated configurations
              refreshCheckout?.();
            };
          }}
        />
        <p
          style={{
            color: settings.color,
            fontSize: '18px',
            fontFamily: 'Avenir',
          }}
        >
          {settings.title}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'yellow'
        }}
      >
        <LeafIcon
          color={settings.iconColor}
        />
        <p
          style={{
            color: settings.color,
            fontSize: '18px',
            fontFamily: 'Avenir',
            fontWeight: 'bold'
          }}
        >
          {`$${settings.amount}`}
        </p>
      </div>
    </div>
  );
};
