import { relations } from "drizzle-orm/relations";
import { supertokensApps, supertokensRoles, supertokensTotpUsers, supertokensTenants, supertokensUserLastActive, supertokensSessionAccessTokenSigningKeys, supertokensEmailverificationVerifiedEmails, supertokensUserMetadata, supertokensRolePermissions, supertokensTenantConfigs, supertokensTenantFirstFactors, supertokensTenantRequiredSecondaryFactors, supertokensAllAuthRecipeUsers, supertokensEmailpasswordUserToTenant, supertokensUserRoles, supertokensAppIdToUserId, supertokensUseridMapping, supertokensKeyValue, supertokensEmailpasswordUsers, supertokensEmailpasswordPswdResetTokens, supertokensThirdpartyUserToTenant, supertokensJwtSigningKeys, supertokensPasswordlessUsers, supertokensPasswordlessUserToTenant, supertokensDashboardUsers, supertokensDashboardUserSessions, supertokensEmailverificationTokens, supertokensThirdpartyUsers, supertokensPasswordlessDevices, supertokensPasswordlessCodes, supertokensTotpUsedCodes, supertokensTotpUserDevices, supertokensSessionInfo, supertokensTenantThirdpartyProviders, supertokensTenantThirdpartyProviderClients } from "./schema";

export const supertokensRolesRelations = relations(supertokensRoles, ({one, many}) => ({
	supertokensApp: one(supertokensApps, {
		fields: [supertokensRoles.appId],
		references: [supertokensApps.appId]
	}),
	supertokensRolePermissions: many(supertokensRolePermissions),
}));

export const supertokensAppsRelations = relations(supertokensApps, ({many}) => ({
	supertokensRoles: many(supertokensRoles),
	supertokensTotpUsers: many(supertokensTotpUsers),
	supertokensTenants: many(supertokensTenants),
	supertokensUserLastActives: many(supertokensUserLastActive),
	supertokensSessionAccessTokenSigningKeys: many(supertokensSessionAccessTokenSigningKeys),
	supertokensEmailverificationVerifiedEmails: many(supertokensEmailverificationVerifiedEmails),
	supertokensUserMetadata: many(supertokensUserMetadata),
	supertokensAppIdToUserIds: many(supertokensAppIdToUserId),
	supertokensJwtSigningKeys: many(supertokensJwtSigningKeys),
	supertokensDashboardUsers: many(supertokensDashboardUsers),
}));

export const supertokensTotpUsersRelations = relations(supertokensTotpUsers, ({one, many}) => ({
	supertokensApp: one(supertokensApps, {
		fields: [supertokensTotpUsers.appId],
		references: [supertokensApps.appId]
	}),
	supertokensTotpUsedCodes: many(supertokensTotpUsedCodes),
	supertokensTotpUserDevices: many(supertokensTotpUserDevices),
}));

export const supertokensTenantsRelations = relations(supertokensTenants, ({one, many}) => ({
	supertokensApp: one(supertokensApps, {
		fields: [supertokensTenants.appId],
		references: [supertokensApps.appId]
	}),
	supertokensUserRoles: many(supertokensUserRoles),
	supertokensKeyValues: many(supertokensKeyValue),
	supertokensEmailverificationTokens: many(supertokensEmailverificationTokens),
	supertokensPasswordlessDevices: many(supertokensPasswordlessDevices),
	supertokensTotpUsedCodes: many(supertokensTotpUsedCodes),
	supertokensAllAuthRecipeUsers: many(supertokensAllAuthRecipeUsers),
	supertokensSessionInfos: many(supertokensSessionInfo),
}));

export const supertokensUserLastActiveRelations = relations(supertokensUserLastActive, ({one}) => ({
	supertokensApp: one(supertokensApps, {
		fields: [supertokensUserLastActive.appId],
		references: [supertokensApps.appId]
	}),
}));

export const supertokensSessionAccessTokenSigningKeysRelations = relations(supertokensSessionAccessTokenSigningKeys, ({one}) => ({
	supertokensApp: one(supertokensApps, {
		fields: [supertokensSessionAccessTokenSigningKeys.appId],
		references: [supertokensApps.appId]
	}),
}));

export const supertokensEmailverificationVerifiedEmailsRelations = relations(supertokensEmailverificationVerifiedEmails, ({one}) => ({
	supertokensApp: one(supertokensApps, {
		fields: [supertokensEmailverificationVerifiedEmails.appId],
		references: [supertokensApps.appId]
	}),
}));

export const supertokensUserMetadataRelations = relations(supertokensUserMetadata, ({one}) => ({
	supertokensApp: one(supertokensApps, {
		fields: [supertokensUserMetadata.appId],
		references: [supertokensApps.appId]
	}),
}));

export const supertokensRolePermissionsRelations = relations(supertokensRolePermissions, ({one}) => ({
	supertokensRole: one(supertokensRoles, {
		fields: [supertokensRolePermissions.appId],
		references: [supertokensRoles.appId]
	}),
}));

export const supertokensTenantFirstFactorsRelations = relations(supertokensTenantFirstFactors, ({one}) => ({
	supertokensTenantConfig: one(supertokensTenantConfigs, {
		fields: [supertokensTenantFirstFactors.connectionUriDomain],
		references: [supertokensTenantConfigs.connectionUriDomain]
	}),
}));

export const supertokensTenantConfigsRelations = relations(supertokensTenantConfigs, ({many}) => ({
	supertokensTenantFirstFactors: many(supertokensTenantFirstFactors),
	supertokensTenantRequiredSecondaryFactors: many(supertokensTenantRequiredSecondaryFactors),
	supertokensTenantThirdpartyProviders: many(supertokensTenantThirdpartyProviders),
}));

export const supertokensTenantRequiredSecondaryFactorsRelations = relations(supertokensTenantRequiredSecondaryFactors, ({one}) => ({
	supertokensTenantConfig: one(supertokensTenantConfigs, {
		fields: [supertokensTenantRequiredSecondaryFactors.connectionUriDomain],
		references: [supertokensTenantConfigs.connectionUriDomain]
	}),
}));

export const supertokensEmailpasswordUserToTenantRelations = relations(supertokensEmailpasswordUserToTenant, ({one}) => ({
	supertokensAllAuthRecipeUser: one(supertokensAllAuthRecipeUsers, {
		fields: [supertokensEmailpasswordUserToTenant.appId],
		references: [supertokensAllAuthRecipeUsers.appId]
	}),
}));

export const supertokensAllAuthRecipeUsersRelations = relations(supertokensAllAuthRecipeUsers, ({one, many}) => ({
	supertokensEmailpasswordUserToTenants: many(supertokensEmailpasswordUserToTenant),
	supertokensThirdpartyUserToTenants: many(supertokensThirdpartyUserToTenant),
	supertokensPasswordlessUserToTenants: many(supertokensPasswordlessUserToTenant),
	supertokensTenant: one(supertokensTenants, {
		fields: [supertokensAllAuthRecipeUsers.appId],
		references: [supertokensTenants.appId]
	}),
	supertokensAppIdToUserId_appId: one(supertokensAppIdToUserId, {
		fields: [supertokensAllAuthRecipeUsers.appId],
		references: [supertokensAppIdToUserId.appId],
		relationName: "supertokensAllAuthRecipeUsers_appId_supertokensAppIdToUserId_appId"
	}),
	supertokensAppIdToUserId_appId: one(supertokensAppIdToUserId, {
		fields: [supertokensAllAuthRecipeUsers.appId],
		references: [supertokensAppIdToUserId.appId],
		relationName: "supertokensAllAuthRecipeUsers_appId_supertokensAppIdToUserId_appId"
	}),
}));

export const supertokensUserRolesRelations = relations(supertokensUserRoles, ({one}) => ({
	supertokensTenant: one(supertokensTenants, {
		fields: [supertokensUserRoles.appId],
		references: [supertokensTenants.appId]
	}),
}));

export const supertokensUseridMappingRelations = relations(supertokensUseridMapping, ({one}) => ({
	supertokensAppIdToUserId: one(supertokensAppIdToUserId, {
		fields: [supertokensUseridMapping.appId],
		references: [supertokensAppIdToUserId.appId]
	}),
}));

export const supertokensAppIdToUserIdRelations = relations(supertokensAppIdToUserId, ({one, many}) => ({
	supertokensUseridMappings: many(supertokensUseridMapping),
	supertokensAppIdToUserId: one(supertokensAppIdToUserId, {
		fields: [supertokensAppIdToUserId.appId],
		references: [supertokensAppIdToUserId.appId],
		relationName: "supertokensAppIdToUserId_appId_supertokensAppIdToUserId_appId"
	}),
	supertokensAppIdToUserIds: many(supertokensAppIdToUserId, {
		relationName: "supertokensAppIdToUserId_appId_supertokensAppIdToUserId_appId"
	}),
	supertokensApp: one(supertokensApps, {
		fields: [supertokensAppIdToUserId.appId],
		references: [supertokensApps.appId]
	}),
	supertokensEmailpasswordUsers: many(supertokensEmailpasswordUsers),
	supertokensEmailpasswordPswdResetTokens: many(supertokensEmailpasswordPswdResetTokens),
	supertokensPasswordlessUsers: many(supertokensPasswordlessUsers),
	supertokensThirdpartyUsers: many(supertokensThirdpartyUsers),
	supertokensAllAuthRecipeUsers_appId: many(supertokensAllAuthRecipeUsers, {
		relationName: "supertokensAllAuthRecipeUsers_appId_supertokensAppIdToUserId_appId"
	}),
	supertokensAllAuthRecipeUsers_appId: many(supertokensAllAuthRecipeUsers, {
		relationName: "supertokensAllAuthRecipeUsers_appId_supertokensAppIdToUserId_appId"
	}),
}));

export const supertokensKeyValueRelations = relations(supertokensKeyValue, ({one}) => ({
	supertokensTenant: one(supertokensTenants, {
		fields: [supertokensKeyValue.appId],
		references: [supertokensTenants.appId]
	}),
}));

export const supertokensEmailpasswordUsersRelations = relations(supertokensEmailpasswordUsers, ({one}) => ({
	supertokensAppIdToUserId: one(supertokensAppIdToUserId, {
		fields: [supertokensEmailpasswordUsers.appId],
		references: [supertokensAppIdToUserId.appId]
	}),
}));

export const supertokensEmailpasswordPswdResetTokensRelations = relations(supertokensEmailpasswordPswdResetTokens, ({one}) => ({
	supertokensAppIdToUserId: one(supertokensAppIdToUserId, {
		fields: [supertokensEmailpasswordPswdResetTokens.appId],
		references: [supertokensAppIdToUserId.appId]
	}),
}));

export const supertokensThirdpartyUserToTenantRelations = relations(supertokensThirdpartyUserToTenant, ({one}) => ({
	supertokensAllAuthRecipeUser: one(supertokensAllAuthRecipeUsers, {
		fields: [supertokensThirdpartyUserToTenant.appId],
		references: [supertokensAllAuthRecipeUsers.appId]
	}),
}));

export const supertokensJwtSigningKeysRelations = relations(supertokensJwtSigningKeys, ({one}) => ({
	supertokensApp: one(supertokensApps, {
		fields: [supertokensJwtSigningKeys.appId],
		references: [supertokensApps.appId]
	}),
}));

export const supertokensPasswordlessUsersRelations = relations(supertokensPasswordlessUsers, ({one}) => ({
	supertokensAppIdToUserId: one(supertokensAppIdToUserId, {
		fields: [supertokensPasswordlessUsers.appId],
		references: [supertokensAppIdToUserId.appId]
	}),
}));

export const supertokensPasswordlessUserToTenantRelations = relations(supertokensPasswordlessUserToTenant, ({one}) => ({
	supertokensAllAuthRecipeUser: one(supertokensAllAuthRecipeUsers, {
		fields: [supertokensPasswordlessUserToTenant.appId],
		references: [supertokensAllAuthRecipeUsers.appId]
	}),
}));

export const supertokensDashboardUsersRelations = relations(supertokensDashboardUsers, ({one, many}) => ({
	supertokensApp: one(supertokensApps, {
		fields: [supertokensDashboardUsers.appId],
		references: [supertokensApps.appId]
	}),
	supertokensDashboardUserSessions: many(supertokensDashboardUserSessions),
}));

export const supertokensDashboardUserSessionsRelations = relations(supertokensDashboardUserSessions, ({one}) => ({
	supertokensDashboardUser: one(supertokensDashboardUsers, {
		fields: [supertokensDashboardUserSessions.appId],
		references: [supertokensDashboardUsers.appId]
	}),
}));

export const supertokensEmailverificationTokensRelations = relations(supertokensEmailverificationTokens, ({one}) => ({
	supertokensTenant: one(supertokensTenants, {
		fields: [supertokensEmailverificationTokens.appId],
		references: [supertokensTenants.appId]
	}),
}));

export const supertokensThirdpartyUsersRelations = relations(supertokensThirdpartyUsers, ({one}) => ({
	supertokensAppIdToUserId: one(supertokensAppIdToUserId, {
		fields: [supertokensThirdpartyUsers.appId],
		references: [supertokensAppIdToUserId.appId]
	}),
}));

export const supertokensPasswordlessCodesRelations = relations(supertokensPasswordlessCodes, ({one}) => ({
	supertokensPasswordlessDevice: one(supertokensPasswordlessDevices, {
		fields: [supertokensPasswordlessCodes.appId],
		references: [supertokensPasswordlessDevices.appId]
	}),
}));

export const supertokensPasswordlessDevicesRelations = relations(supertokensPasswordlessDevices, ({one, many}) => ({
	supertokensPasswordlessCodes: many(supertokensPasswordlessCodes),
	supertokensTenant: one(supertokensTenants, {
		fields: [supertokensPasswordlessDevices.appId],
		references: [supertokensTenants.appId]
	}),
}));

export const supertokensTotpUsedCodesRelations = relations(supertokensTotpUsedCodes, ({one}) => ({
	supertokensTotpUser: one(supertokensTotpUsers, {
		fields: [supertokensTotpUsedCodes.appId],
		references: [supertokensTotpUsers.appId]
	}),
	supertokensTenant: one(supertokensTenants, {
		fields: [supertokensTotpUsedCodes.appId],
		references: [supertokensTenants.appId]
	}),
}));

export const supertokensTotpUserDevicesRelations = relations(supertokensTotpUserDevices, ({one}) => ({
	supertokensTotpUser: one(supertokensTotpUsers, {
		fields: [supertokensTotpUserDevices.appId],
		references: [supertokensTotpUsers.appId]
	}),
}));

export const supertokensSessionInfoRelations = relations(supertokensSessionInfo, ({one}) => ({
	supertokensTenant: one(supertokensTenants, {
		fields: [supertokensSessionInfo.appId],
		references: [supertokensTenants.appId]
	}),
}));

export const supertokensTenantThirdpartyProviderClientsRelations = relations(supertokensTenantThirdpartyProviderClients, ({one}) => ({
	supertokensTenantThirdpartyProvider: one(supertokensTenantThirdpartyProviders, {
		fields: [supertokensTenantThirdpartyProviderClients.connectionUriDomain],
		references: [supertokensTenantThirdpartyProviders.connectionUriDomain]
	}),
}));

export const supertokensTenantThirdpartyProvidersRelations = relations(supertokensTenantThirdpartyProviders, ({one, many}) => ({
	supertokensTenantThirdpartyProviderClients: many(supertokensTenantThirdpartyProviderClients),
	supertokensTenantConfig: one(supertokensTenantConfigs, {
		fields: [supertokensTenantThirdpartyProviders.connectionUriDomain],
		references: [supertokensTenantConfigs.connectionUriDomain]
	}),
}));