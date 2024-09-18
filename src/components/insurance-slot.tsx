import React, { type FC } from 'react';
import { httpClient } from '@wix/essentials';
import {CalculationMethod, Settings} from '../types'
import { Switch, Tooltip } from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";

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
    const amountTitle = (): string => {
        if (settings.calculationMethod === CalculationMethod.FIXED) {
            return `$${settings.amount} insurance fee will be added`;
        } if (settings.calculationMethod === CalculationMethod.PERCENTAGE_FROM_TOTAL) {
            return `${settings.amount}% fee of items total will be added`;
        } else {
            return `${settings.amount}% fee of the shipping cost will be added`;
        }
    };


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
              <div
                  style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                  }}>
              <p
                  style={{
                      fontSize: '18px',
                      fontFamily: 'Avenir',
                      fontWeight: 500,
                  }}
              >
                  Protect your order?
              </p>
                  <Tooltip title={settings.description}>
                    <InfoCircleOutlined style={{ fontSize: '16px'}} />
                  </Tooltip>
              </div>
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
              {amountTitle()}
          </p>
      </div>
  );
};
