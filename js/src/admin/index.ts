// js/src/admin/index.ts

import app from 'flarum/admin/app';
import commonApp from 'flarum/common/app';

import registerWidget from '../common/register';
import { extName } from '../common/extName';

app.initializers.add(extName, () => {
  // 1) 在 Afrux Widgets Core 中注册 widget（后台布局管理需要）
  registerWidget(commonApp);

  // 2) 注册扩展设置项
  const extension = app.extensionData.for(extName);

  extension
    .registerSetting({
      setting: 'liplum-trends.defaultLimit',
      label: app.translator.trans(
        'liplum-trends.admin.defaultLimit.label'
      ),
      help: app.translator.trans(
        'liplum-trends.admin.defaultLimit.help'
      ),
      type: 'number',
    })
    .registerSetting({
      setting: 'liplum-trends.commentWeight',
      label: app.translator.trans(
        'liplum-trends.admin.commentWeight.label'
      ),
      help: app.translator.trans(
        'liplum-trends.admin.commentWeight.help'
      ),
      type: 'number',
    })
    .registerSetting({
      setting: 'liplum-trends.participantWeight',
      label: app.translator.trans(
        'liplum-trends.admin.participantWeight.label'
      ),
      help: app.translator.trans(
        'liplum-trends.admin.participantWeight.help'
      ),
      type: 'number',
    })
    .registerSetting({
      setting: 'liplum-trends.viewWeight',
      label: app.translator.trans(
        'liplum-trends.admin.viewWeight.label'
      ),
      help: app.translator.trans(
        'liplum-trends.admin.viewWeight.help'
      ),
      type: 'number',
    })
    .registerSetting({
      setting: 'liplum-trends.daysLimit',
      label: app.translator.trans(
        'liplum-trends.admin.daysLimit.label'
      ),
      help: app.translator.trans(
        'liplum-trends.admin.daysLimit.help'
      ),
      type: 'number',
    })
    .registerSetting({
      setting: 'liplum-trends.limit',
      label: app.translator.trans(
        'liplum-trends.admin.widget_limit.label'
      ),
      help: app.translator.trans(
        'liplum-trends.admin.widget_limit.help'
      ),
      type: 'number',
    });
});

