// js/src/common/register.ts

import type Application from 'flarum/common/Application';
import Widgets from 'flarum/extensions/afrux-forum-widgets-core/common/extend/Widgets';

import TrendsWidget from '../forum/components/TrendsWidget';
import { extName } from './extName';

export default function registerWidget(app: Application) {
  new Widgets()
    .add({
      key: 'liplum-trends-widget',
      component: TrendsWidget,
      isDisabled: false,
      isUnique: true,
      placement: 'top',
      position: 1,
    })
    .extend(app, extName);
}
