import React, { type FC } from 'react';
import { dashboard } from '@wix/dashboard';
import {
  WixDesignSystemProvider,
  Text,
  Box,
  CustomModalLayout,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { width, height } from './modal.json';

// To open your modal, call `openModal` with your modal id.
// e.g.
// import { dashboard } from '@wix/dashboard';
// function MyComponent() {
//   return <button onClick={() => dashboard.openModal('621e4ce0-037d-48bf-a9ec-9a53e7553921')}>Open Modal</button>;
// }
const Modal: FC = () => {
  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <CustomModalLayout
        width={width}
        maxHeight={height}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onCloseButtonClick={() => dashboard.closeModal()}
        primaryButtonOnClick={() => dashboard.closeModal()}
        secondaryButtonOnClick={() => dashboard.closeModal()}
        title="Manage Insurance"
        subtitle="Edit this file to customize your modal"
        content={
          <Box direction="vertical" align="center">
            <Text>Wix CLI Modal</Text>
          </Box>
        }
      />
    </WixDesignSystemProvider>
  );
};

export default Modal;
