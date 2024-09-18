import React, { type FC } from 'react';
import {
    Box, Cell, Dropdown,
    FormField,
    Input,
    Layout,
    NumberInput
} from '@wix/design-system';
import {CalculationMethod, EligibleItems, Settings} from '../types';
import '@wix/design-system/styles.global.css';
import { PluginPreview } from './plugin-preview';

type Props = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};


export const SettingsForm: FC<Props> = ({
  settings,
  setSettings,
}) => {
    const amountTitle = settings.calculationMethod === CalculationMethod.FIXED ? 'Define fixed price for the insurance' : 'Define percentage of the total price for the insurance ';
    const amountPrefix = settings.calculationMethod === CalculationMethod.FIXED ? '$' : '%';

    return (
    <Layout>
        <Cell span={6}>
            <Box gap={3} direction="vertical">
                <FormField
                    required
                    label='What items should insurance be collected for?'
                >
                    <Dropdown
                        placeholder='Select items'
                        options={[
                            { id: EligibleItems.ALL, value: 'All' },
                            { id: EligibleItems.SHIPPABLE, value: 'Only shippable items' },
                        ]}
                        initialSelectedId={EligibleItems.ALL}
                        onSelect={(option) => setSettings({
                            ...settings,
                            eligibleItems: option.id as EligibleItems,
                        })}
                    />
                </FormField>
                <FormField
                    required
                    label='Insurance calculation:'
                >
                    <Dropdown
                        placeholder='Insurance claculation'
                        options={[
                            { id: CalculationMethod.FIXED, value: 'FIXED' },
                            { id: CalculationMethod.PERCENTAGE_FROM_TOTAL, value: 'PERCENTAGE_FROM_TOTAL' },
                            { id: CalculationMethod.PERCENTAGE_FROM_SHIPPING_COST, value: 'PERCENTAGE_FROM_SHIPPING_COST' },
                        ]}
                        initialSelectedId={CalculationMethod.FIXED}
                        onSelect={(option) => setSettings({
                            ...settings,
                            calculationMethod: option.id as CalculationMethod,
                        })}
                    />
                </FormField>
                <FormField
                    required
                    label= {amountTitle}
                >
                    <NumberInput
                        value={settings.amount}
                        prefix={<Input.Affix value={amountPrefix} />}
                        min={1}
                        onChange={(val) => setSettings({
                            ...settings,
                            amount: val ?? 1,
                        })}
                    />
                </FormField>
                <FormField
                    required
                    label='Explain to your users about the Insurance'
                >
                    <Input
                        value={settings.description}
                        placeholder='description'
                        onChange={(val) => setSettings({
                            ...settings,
                            title: val.target.value
                        })}
                    />
                </FormField>
            </Box>
        </Cell>
        <Cell span={6}>
            <PluginPreview {...settings}/>
        </Cell>
    </Layout>
  );
};
