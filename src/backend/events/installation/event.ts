import { auth } from '@wix/essentials';
import { collections } from '@wix/data';
import { appInstances } from '@wix/app-management';
import { CHECKOUT_COLLECTION_ID, SETTINGS_COLLECTION_ID } from '../../consts';

appInstances.onAppInstanceInstalled(() => {
  auth.elevate(collections.createDataCollection)({
    _id: SETTINGS_COLLECTION_ID,
    displayName: "Insurance App Settings",
    fields: [
      { key: 'title', type: collections.Type.TEXT },
      { key: 'amount', type: collections.Type.NUMBER },
      { key: 'color', type: collections.Type.TEXT },
      { key: 'iconColor', type: collections.Type.TEXT },
    ],
    permissions: {
      // Make sure to change the permissions according to the actual usage of your collection
      insert: collections.Role.ADMIN,
      read: collections.Role.ADMIN,
      remove: collections.Role.ADMIN,
      update: collections.Role.ADMIN,
    },
    // Plugin for single item collection
    plugins: [{
      type: collections.PluginType.SINGLE_ITEM,
      singleItemOptions: {
        singleItemId: "SETTINGS"
      },
    }],
  });

  auth.elevate(collections.createDataCollection)({
    _id: CHECKOUT_COLLECTION_ID,
    displayName: "Checkout Items Insurance",
    fields: [
      { key: 'shouldInsure', type: collections.Type.BOOLEAN },
    ],
    permissions: {
      // Make sure to change the permissions according to the actual usage of your collection
      insert: collections.Role.ANYONE,
      read: collections.Role.ANYONE,
      remove: collections.Role.ANYONE,
      update: collections.Role.ANYONE,
    },
  });
});
