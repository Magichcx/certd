import * as api from "./api";
import { useI18n } from "vue-i18n";
import { computed, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, dict, EditReq, UserPageQuery, UserPageRes, utils } from "@fast-crud/fast-crud";
import { useUserStore } from "/@/store/modules/user";
import { useSettingStore } from "/@/store/modules/settings";

export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const router = useRouter();
  const { t } = useI18n();
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
    form.id = row.id;
    const res = await api.UpdateObj(form);
    return res;
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }: AddReq) => {
    form.content = JSON.stringify({
      title: form.title
    });
    const res = await api.AddObj(form);
    return res;
  };

  const userStore = useUserStore();
  const settingStore = useSettingStore();
  const selectedRowKeys: Ref<any[]> = ref([]);
  context.selectedRowKeys = selectedRowKeys;

  return {
    crudOptions: {
      settings: {
        plugins: {
          //这里使用行选择插件，生成行选择crudOptions配置，最终会与crudOptions合并
          rowSelection: {
            enabled: true,
            order: -2,
            before: true,
            // handle: (pluginProps,useCrudProps)=>CrudOptions,
            props: {
              multiple: true,
              crossPage: true,
              selectedRowKeys
            }
          }
        }
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      rowHandle: {
        minWidth: 200,
        fixed: "right"
      },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "number",
          column: {
            width: 100
          },
          form: {
            show: false
          }
        },
        domain: {
          title: "被代理域名",
          type: "text",
          search: {
            show: true
          },
          editForm: {
            component: {
              disabled: true
            }
          }
        },
        hostRecord: {
          title: "主机记录",
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 250,
            cellRender: ({ value }) => {
              return <fs-copyable v-model={value} />;
            }
          }
        },
        recordValue: {
          title: "请设置CNAME",
          type: "copyable",
          form: {
            show: false
          },
          column: {
            width: 500
          }
        },
        cnameProviderId: {
          title: "CNAME提供者",
          type: "dict-select",
          dict: dict({
            url: "/cname/provider/list",
            value: "id",
            label: "domain"
          }),
          form: {
            component: {
              onDictChange: ({ form, dict }) => {
                if (!form.cnameProviderId) {
                  const item = dict.data.find((item) => item.isDefault);
                  if (item) {
                    form.cnameProviderId = item.id;
                  }
                }
              }
            }
          },
          column: {
            show: false
          }
        },
        status: {
          title: "状态",
          type: "dict-select",
          dict: dict({
            data: [
              { label: "待设置CNAME", value: "cname", color: "warning" },
              { label: "验证中", value: "validating", color: "primary" },
              { label: "验证成功", value: "valid", color: "success" },
              { label: "验证失败", value: "failed", color: "error" }
            ]
          }),
          addForm: {
            show: false
          },
          column: {
            width: 120,
            align: "center"
          }
        },
        triggerValidate: {
          title: "验证",
          type: "text",
          form: {
            show: false
          },
          column: {
            conditionalRenderDisabled: true,
            width: 100,
            align: "center",
            cellRender({ row, value }) {
              if (row.status === "valid") {
                return "-";
              }
              return (
                <a-button size={"small"} type={"primary"}>
                  点击验证
                </a-button>
              );
            }
          }
        },
        createTime: {
          title: "创建时间",
          type: "datetime",
          form: {
            show: false
          },
          column: {
            sorter: true,
            width: 160,
            align: "center"
          }
        },
        updateTime: {
          title: "更新时间",
          type: "datetime",
          form: {
            show: false
          },
          column: {
            show: true
          }
        }
      }
    }
  };
}