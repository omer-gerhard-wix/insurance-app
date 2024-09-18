import React, { type FC } from 'react';
import { httpClient } from '@wix/essentials';
import type { Settings } from '../types'
import { Switch } from "antd";

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
  checked = false,
  refreshCheckout,
}) => {
  return (
      <div
          style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: "10px",
              width: '100%',
          }}
      >
          <div
              style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
              }}
          >
              <p
                  style={{
                      fontSize: '18px',
                      fontFamily: 'Avenir',
                  }}
              >
                  Protect your order?
              </p>
              <Switch defaultChecked={checked} onChange={async (e) => {
                  if (purchaseFlowId) {
                      await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/checkout`, {
                          method: 'POST',
                          body: JSON.stringify({
                              purchaseFlowId,
                              shouldInsure: e,
                          }),
                      });

                      // Known Issue: Refresh Checkout is not yet implemented in Custom Element plugins (Wix CLI)
                      // to workaround it after using the plugin in the site - go out of the checkout and back again
                      // in order for it to reload and call the relevant SPIs with you updated configurations
                      refreshCheckout?.();
                  }
              }}/>
          </div>
          <p
              style={{
                  fontSize: '14px',
                  fontFamily: 'Avenir',
              }}
          >
              {settings.description}
          </p>
          <p
              style={{
                  fontSize: '14px',
                  fontFamily: 'Avenir',
              }}
          >
              Amount: {settings.amount}
          </p>
      </div>
  );
};
