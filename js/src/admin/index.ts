import app from 'flarum/admin/app';
import { extName } from '../common/extName';

app.initializers.add(extName, () => {
  const extension = app.extensionData.for(extName);

  // 原 trends 设置：默认条数 & 热度权重参数
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
    // 新增：Widget 显示条数
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
