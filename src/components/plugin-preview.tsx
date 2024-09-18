import React, { type FC } from 'react';
import { InsuranceSlot } from './insurance-slot';
import { Box } from '@wix/design-system';
import checkoutScreenshot from '../assets/checkoutWithSlot.png';
import type { Settings } from '../types';
import '@wix/design-system/styles.global.css';

export const PluginPreview: FC<Settings> = (settings) => {
  return (
    <Box
      borderRadius={'4px'}
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
          boxShadow='lightgrey -2px 2px 12px 2px'
          marginTop={8}
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
