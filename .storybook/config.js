import { configure } from '@storybook/react';

configure(require.context('../stories', true), module);
