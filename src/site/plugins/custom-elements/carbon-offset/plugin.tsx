import React, { useEffect, useState, useMemo, type FC } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import { httpClient } from '@wix/essentials';
import { checkout } from '@wix/ecom';
import { InsuranceSlot } from '../../../../components/insurance-slot';
import { PluginSkeleton } from '../../../../components/plugin-skeleton/plugin-skeleton';
import type { Settings } from '../../../../types';

type Props = {
  checkoutId: string;
};

type CallbackFunction = () => void;

let refreshCheckout: CallbackFunction = () => {
  console.log("Checkout Refreshed");
};

const CustomElement: FC<Props> = (props) => {
  const [settings, setSettings] = useState<Settings>();
  const [checked, setChecked] = useState<boolean>(false);
  const [purchaseFlowId, setPurchaseFlowId] = useState<string>('');

  const checkoutId = useMemo(() => {
    return props.checkoutId && props.checkoutId.replaceAll('"', '');
  }, [props.checkoutId]);

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsRes = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`);
      return settingsRes.json();
    };

    const fetchData = async () => {
      const [settingsData, { purchaseFlowId }] = await Promise.all([fetchSettings(), checkout.getCheckout(checkoutId)]);
      const checkoutRes = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/checkout?purchaseFlowId=${purchaseFlowId}`);
      const checkoutData = await checkoutRes.json();

      setSettings(settingsData);
      setPurchaseFlowId(purchaseFlowId ?? '');
      setChecked(checkoutData.shouldInsure ?? false);
    };

    if (checkoutId) {
      fetchData();
    };
  }, [checkoutId]);


  return (
    <>
      {!settings || !settings.enabled ? (
        <PluginSkeleton />
      ) : (
        <InsuranceSlot
          settings={settings}
          purchaseFlowId={purchaseFlowId}
          checkoutId={checkoutId}
          checked={checked}
          refreshCheckout={refreshCheckout}
        />
      )}
    </>
  );
};

const customElement = reactToWebComponent(
  CustomElement,
  React,
  ReactDOM as any,
  {
    props: {
      checkoutId: 'string',
    },
  }
);

// Not yet implemented
customElement.prototype.onRefreshCheckout = (callback: CallbackFunction) => {
  refreshCheckout = callback;
};

export default customElement;
