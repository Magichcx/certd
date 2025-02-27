import { request } from "/src/api/service";
const apiPrefix = "/sys/authority/role";
export async function GetList(query: any) {
  return await request({
    url: apiPrefix + "/page",
    method: "post",
    data: query
  });
}

export async function AddObj(obj: any) {
  return await request({
    url: apiPrefix + "/add",
    method: "post",
    data: obj
  });
}

export async function UpdateObj(obj: any) {
  return await request({
    url: apiPrefix + "/update",
    method: "post",
    data: obj
  });
}

export async function DelObj(id: any) {
  return await request({
    url: apiPrefix + "/delete",
    method: "post",
    params: { id }
  });
}

export async function GetObj(id: any) {
  return await request({
    url: apiPrefix + "/info",
    method: "post",
    params: { id }
  });
}

/**
 * 获取角色权限资源
 * @param roleId
 * @returns {*}
 * @constructor
 */
export async function getPermissionIds(roleId: any) {
  return await request({
    url: apiPrefix + "/getPermissionIds",
    method: "post",
    params: { id: roleId }
  });
}

/**
 * 授权
 * @param roleId
 * @param permissionIds
 * @returns {*}
 * @constructor
 */
export async function DoAuthz(roleId: any, permissionIds: any) {
  return await request({
    url: apiPrefix + "/authz",
    method: "post",
    data: { roleId, permissionIds }
  });
}
