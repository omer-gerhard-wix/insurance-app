import React, { type FC } from 'react';
import { InsuranceSlot } from './insurance-slot';
import { Box } from '@wix/design-system';
import checkoutScreenshot from '../assets/checkout.png';
import type { Settings } from '../types';
import '@wix/design-system/styles.global.css';

export const PluginPreview: FC<Settings> = (settings) => {
  return (
    <Box
      verticalAlign='middle'
      align='center'
      height={400}
      backgroundImage={`url(${checkoutScreenshot})`}
      backgroundPosition='center'
      backgroundSize='contain'
      backgroundRepeat='no-repeat'
      backgroundColor='#f0f0f0'
    >
      <Box
        width={'100%'}
        height={'100%'}
        align='center'
        verticalAlign='middle'
        backdropFilter='blur(2px)'
      >
        <Box
          padding={'12px 24px'}
          width={'50%'}
          boxShadow='-4px 4px 24px 2px lightgrey'
          marginTop={6}
          scale={'1.2'}
          backgroundColor='rgba(240, 240, 240, 0.9)'
        >
          <InsuranceSlot
            settings={settings}
          />
        </Box>
      </Box>
    </Box>
  );
};
