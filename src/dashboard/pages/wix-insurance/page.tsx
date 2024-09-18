import React, { useEffect, useState, type FC } from 'react';
import { httpClient } from '@wix/essentials';
import {
  Box,
  Card,
  Cell,
  Layout,
  Loader,
  Page, ToggleSwitch,
  WixDesignSystemProvider,
} from '@wix/design-system';
import { MainButton } from '../../../components/main-button';
import { SettingsForm } from '../../../components/settings-form';
import type { Settings } from '../../../types';
import '@wix/design-system/styles.global.css';
import { PluginPreview } from '../../../components/plugin-preview';

const Index: FC = () => {
  const [settings, setSettings] = useState<Settings>()
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`);
      const data: Settings = (await res.json());
      setEnabled(data.enabled);
      setSettings(data);
    };

    fetchSettings();
  }, []);

  const onChange = () => {
    setEnabled(!enabled)
  };

  return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        {!settings ? (
            <Box
                height='100vh'
                align='center'
                verticalAlign='middle'
            >
              <Loader />
            </Box>
        ) : (
            <Page height='100vh'>
              <Page.Header
                  title="Wix Insurance"
                  subtitle="Let your customers insure their purchase."
                  actionsBar={
                    <MainButton {...settings} enabled={enabled} />
                  }
              />
              <Page.Content>
                <Layout>
                  <Cell >
                    <Card stretchVertically>
                      <Card.Header
                          title="Enable insurance at checkout"
                          subtitle="This appears on your checkout page."
                          suffix={
                        <ToggleSwitch
                              skin="success"
                              checked={enabled}
                              onChange={onChange}
                          />}
                      />
                    </Card>
                  </Cell>
                  <Cell span={8}>
                    <Card stretchVertically>
                      <Card.Header
                          title="Settings"
                      />
                      <Card.Divider />
                      <Card.Content>
                        <SettingsForm
                            settings={settings}
                            setSettings={setSettings}
                        />
                      </Card.Content>
                    </Card>
                  </Cell>
                  <Cell span={4}>
                    <Card stretchVertically>
                      <Card.Header
                          title="Preview"
                      />
                      <Card.Divider />
                      <Card.Content>
                        <PluginPreview {...settings}/>
                      </Card.Content>
                    </Card>
                  </Cell>
                </Layout>
              </Page.Content>
            </Page>
        )}
      </WixDesignSystemProvider >
  );
};

export default Index;
