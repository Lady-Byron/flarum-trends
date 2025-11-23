import app from 'flarum/common/app';

import Widget, {
  WidgetAttrs,
} from 'flarum/extensions/afrux-forum-widgets-core/common/components/Widget';

import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Link from 'flarum/common/components/Link';
import icon from 'flarum/common/helpers/icon';
import Discussion from 'flarum/common/models/Discussion';

import { extName } from '../extName';

// 我们不再需要详细定义 Response 接口，因为我们将使用 Flarum 的 Store 模型
interface TrendsWidgetAttrs extends WidgetAttrs {}

export default class TrendsWidget extends Widget<TrendsWidgetAttrs> {
  loading: boolean = true;
  // 将类型改为 Flarum 的 Discussion 模型数组
  trends: Discussion[] = [];

  className(): string {
    return 'liplum-trends-widget';
  }

  icon(): string {
    // 去掉颜色，保持统一风格
    return 'fas fa-fire-alt';
  }

  title(): string {
    return app.translator.trans(
      `${extName}.forum.widget.title`
    ) as string;
  }

  content() {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    if (!this.trends || this.trends.length === 0) {
      return (
        <div className="liplum-trends-empty">
          {app.translator.trans(`${extName}.forum.widget.empty`)}
        </div>
      );
    }

    return (
      <div className="liplum-trends-content">
        <ul className="liplum-trends-list">
          {this.trends.map((disc) => (
            <li className="liplum-trends-item" key={disc.id()}>
              <Link
                href={app.route.discussion(disc)}
                className="liplum-trends-link"
              >
                {/* 左侧装饰点 */}
                <span className="liplum-trends-bullet" />

                {/* 标题 */}
                <span className="liplum-trends-title">
                  {disc.title()}
                </span>

                {/* 右侧统计 */}
                <span className="liplum-trends-stats">
                  {icon('fas fa-comment-alt')} {disc.commentCount()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  oncreate(vnode: any) {
    super.oncreate(vnode);
    this.fetchTrends();
  }

  async fetchTrends() {
    // —— 环境 / 权限防守 —— //
    const forum = (app as any).forum;

    // 在 admin 的 Afrux 布局预览里，很可能没有 forum 实例：直接不请求
    if (!forum || typeof forum.attribute !== 'function') {
      this.loading = false;
      this.trends = [];
      app.redraw();
      return;
    }

    // 没有查看论坛权限：不请求、不显示列表
    if (!forum.attribute('canViewForum')) {
      this.loading = false;
      this.trends = [];
      app.redraw();
      return;
    }

    this.loading = true;

    // 从论坛属性中读取 widget 的显示数量（默认 5）
    const rawLimit = forum.attribute(`${extName}.limit`);
    const limit =
      typeof rawLimit === 'number'
        ? rawLimit
        : parseInt((rawLimit as string) || '', 10) || 5;

    const params: Record<string, any> = {};

    // 获取 2 倍数量，过滤后再截断
    params.limit = limit * 2;

    // [关键] 请求关联数据，便于前端使用 tags/state/user
    params.include = 'tags,state,user';

    try {
      const response = await app.request<any>({
        method: 'GET',
        url: forum.attribute('apiUrl') + '/trends/recent',
        params,
      });

      // [核心步骤] 将数据推入 Flarum Store
      // 这会将 raw JSON 转换为带有方法的 Discussion 模型
      app.store.pushPayload(response);

      const data = (response && (response as any).data) || [];
      const models = (Array.isArray(data) ? data : [])
        .map((record) =>
          app.store.getById('discussions', record.id)
        )
        .filter((disc: Discussion | null) => !!disc) as Discussion[];

      // [过滤逻辑] 联动 block-tags：
      // 只要有一个标签 subscription() === 'hide'，就隐藏该主题
      const filtered = models.filter((disc) => {
        const tags = disc.tags?.();
        if (!tags) return true;

        return !tags.some(
          (tag: any) =>
            typeof tag.subscription === 'function' &&
            tag.subscription() === 'hide'
        );
      });

      // 截取最终需要的数量
      this.trends = filtered.slice(0, limit);
    } catch (error) {
      // 出错时不抛到界面上，只在控制台提示
      // eslint-disable-next-line no-console
      console.error('[liplum-trends] Error fetching trends:', error);
      this.trends = [];
    } finally {
      this.loading = false;
      app.redraw();
    }
  }
}
