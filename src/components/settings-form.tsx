import React, { type FC } from 'react';
import {
  Box,
  FormField,
  Input,
  NumberInput
} from '@wix/design-system';
import type { Settings } from '../types';
import '@wix/design-system/styles.global.css';

type Props = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

export const SettingsForm: FC<Props> = ({
  settings,
  setSettings,
}) => {
  return (
    <Box gap={3} direction="vertical">
      <Box gap={3} direction="vertical" width={'100%'}>
        <FormField
          required
          label='Amount'
        >
          <NumberInput
            value={settings.amount}
            prefix={<Input.Affix value='$' />}
            min={1}
            onChange={(val) => setSettings({
              ...settings,
              amount: val ?? 1,
            })}
          />
        </FormField>
        <FormField
          required
          label='Content'
        >
          <Input
            value={settings.title}
            placeholder='e.g. Protect your order'
            onChange={(val) => setSettings({
              ...settings,
              title: val.target.value
            })}
          />
        </FormField>
      </Box>
    </Box>
  );
};
