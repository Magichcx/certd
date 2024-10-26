import { AbstractTaskPlugin, IsTaskPlugin, pluginGroups, RunStrategy, TaskInput } from '@certd/pipeline';

@IsTaskPlugin({
  name: 'RestartCertd',
  title: '重启Certd',
  icon: 'mdi:restart',
  desc: '【仅管理员】延迟一定时间后自动杀死自己，然后通过Docker来自动重启',
  group: pluginGroups.other.key,
  default: {
    strategy: {
      runStrategy: RunStrategy.SkipWhenSucceed,
    },
  },
})
export class RestartCertdPlugin extends AbstractTaskPlugin {
  @TaskInput({
    title: '延迟时间',
    value: 30,
    component: {
      placeholder: '30',
    },
    helper: '延迟多少秒后执行',
    required: true,
  })
  delay = 30;
  async onInstance() {}
  async execute(): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('只有管理员才能运行此任务');
    }
    this.logger.info(`Certd 将在 ${this.delay} 秒后关闭`);
    setTimeout(() => {
      this.logger.info('关闭 Certd');
      process.exit(1);
    }, this.delay * 1000);
  }
}
new RestartCertdPlugin();
