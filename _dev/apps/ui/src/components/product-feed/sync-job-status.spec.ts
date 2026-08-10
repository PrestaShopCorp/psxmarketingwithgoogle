import {mount} from '@vue/test-utils';
import config from '@/../tests/init';
import SyncJobStatus from './sync-job-status.vue';

describe('sync-job-status.vue', () => {
  it('renders durable job counts and emits a failed-only retry', async () => {
    const wrapper = mount(SyncJobStatus, {
      ...config,
      propsData: {
        job: {
          jobId: 9,
          status: 'partial',
          total: 10,
          succeeded: 8,
          failed: 2,
          skipped: 0,
          pending: 0,
          errors: [
            {
              offerKey: 'lamp-1',
              code: 'invalid_value',
              field: 'title',
              message: 'The title is too long.',
            },
          ],
        },
      },
    });

    expect(wrapper.text()).toContain('8 of 10 products synchronized');
    expect(wrapper.text()).toContain('2 failed');
    expect(wrapper.text()).toContain('lamp-1');
    expect(wrapper.text()).toContain('The title is too long.');
    await wrapper.find('[data-test="retry-failed"]').trigger('click');
    expect(wrapper.emitted('retry')).toEqual([[9]]);
  });

  it('does not offer retry while a durable job is still active', () => {
    const wrapper = mount(SyncJobStatus, {
      ...config,
      propsData: {
        job: {
          jobId: 10,
          status: 'running',
          total: 10,
          succeeded: 4,
          failed: 0,
          skipped: 1,
          pending: 5,
          errors: [],
        },
      },
    });

    expect(wrapper.text()).toContain('4 of 10 products synchronized');
    expect(wrapper.find('[data-test="retry-failed"]').exists()).toBe(false);
  });

  it('renders a counts-only run response without requiring an error list', () => {
    const wrapper = mount(SyncJobStatus, {
      ...config,
      propsData: {
        job: {
          jobId: 11,
          status: 'running',
          total: 10,
          succeeded: 4,
          failed: 1,
          skipped: 0,
          pending: 5,
        },
      },
    });

    expect(wrapper.text()).toContain('4 of 10 products synchronized');
    expect(wrapper.find('[data-test="sync-errors"]').exists()).toBe(false);
  });
});
