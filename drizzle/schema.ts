import { pgTable, varchar, bigint, serial, char, boolean, index, foreignKey, primaryKey, text, unique, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const supertokensApps = pgTable("supertokens_apps", {
	appId: varchar("app_id", { length: 64 }).default('public').primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAtTime: bigint("created_at_time", { mode: "number" }),
});

export const userSettings = pgTable("user_settings", {
	id: serial("id").primaryKey().notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	guessKanji: boolean("guess_kanji").default(true).notNull(),
});

export const supertokensRoles = pgTable("supertokens_roles", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	role: varchar("role", { length: 255 }).notNull(),
},
(table) => {
	return {
		rolesAppIdIdx: index("roles_app_id_index").using("btree", table.appId.asc().nullsLast()),
		supertokensRolesAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_roles_app_id_fkey"
		}).onDelete("cascade"),
		supertokensRolesPkey: primaryKey({ columns: [table.appId, table.role], name: "supertokens_roles_pkey"}),
	}
});

export const supertokensTotpUsers = pgTable("supertokens_totp_users", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: varchar("user_id", { length: 128 }).notNull(),
},
(table) => {
	return {
		totpUsersAppIdIdx: index("totp_users_app_id_index").using("btree", table.appId.asc().nullsLast()),
		supertokensTotpUsersAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_totp_users_app_id_fkey"
		}).onDelete("cascade"),
		supertokensTotpUsersPkey: primaryKey({ columns: [table.appId, table.userId], name: "supertokens_totp_users_pkey"}),
	}
});

export const supertokensTenants = pgTable("supertokens_tenants", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAtTime: bigint("created_at_time", { mode: "number" }),
},
(table) => {
	return {
		tenantsAppIdIdx: index("tenants_app_id_index").using("btree", table.appId.asc().nullsLast()),
		supertokensTenantsAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_tenants_app_id_fkey"
		}).onDelete("cascade"),
		supertokensTenantsPkey: primaryKey({ columns: [table.appId, table.tenantId], name: "supertokens_tenants_pkey"}),
	}
});

export const supertokensUserLastActive = pgTable("supertokens_user_last_active", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: varchar("user_id", { length: 128 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	lastActiveTime: bigint("last_active_time", { mode: "number" }),
},
(table) => {
	return {
		userLastActiveAppIdIdx: index("user_last_active_app_id_index").using("btree", table.appId.asc().nullsLast()),
		supertokensUserLastActiveAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_user_last_active_app_id_fkey"
		}).onDelete("cascade"),
		supertokensUserLastActivePkey: primaryKey({ columns: [table.appId, table.userId], name: "supertokens_user_last_active_pkey"}),
	}
});

export const supertokensSessionAccessTokenSigningKeys = pgTable("supertokens_session_access_token_signing_keys", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAtTime: bigint("created_at_time", { mode: "number" }).notNull(),
	value: text("value"),
},
(table) => {
	return {
		accessTokenSigningKeysAppIdIdx: index("access_token_signing_keys_app_id_index").using("btree", table.appId.asc().nullsLast()),
		supertokensSessionAccessTokenSigningKeysAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_session_access_token_signing_keys_app_id_fkey"
		}).onDelete("cascade"),
		supertokensSessionAccessTokenSigningKeysPkey: primaryKey({ columns: [table.appId, table.createdAtTime], name: "supertokens_session_access_token_signing_keys_pkey"}),
	}
});

export const supertokensEmailverificationVerifiedEmails = pgTable("supertokens_emailverification_verified_emails", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: varchar("user_id", { length: 128 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
},
(table) => {
	return {
		emailverificationVerifiedEmailsAppIdIdx: index("emailverification_verified_emails_app_id_index").using("btree", table.appId.asc().nullsLast()),
		supertokensEmailverificationVerifiedEmailsAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_emailverification_verified_emails_app_id_fkey"
		}).onDelete("cascade"),
		supertokensEmailverificationVerifiedEmailsPkey: primaryKey({ columns: [table.appId, table.userId, table.email], name: "supertokens_emailverification_verified_emails_pkey"}),
	}
});

export const supertokensUserMetadata = pgTable("supertokens_user_metadata", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: varchar("user_id", { length: 128 }).notNull(),
	userMetadata: text("user_metadata").notNull(),
},
(table) => {
	return {
		userMetadataAppIdIdx: index("user_metadata_app_id_index").using("btree", table.appId.asc().nullsLast()),
		supertokensUserMetadataAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_user_metadata_app_id_fkey"
		}).onDelete("cascade"),
		supertokensUserMetadataPkey: primaryKey({ columns: [table.appId, table.userId], name: "supertokens_user_metadata_pkey"}),
	}
});

export const supertokensRolePermissions = pgTable("supertokens_role_permissions", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	role: varchar("role", { length: 255 }).notNull(),
	permission: varchar("permission", { length: 255 }).notNull(),
},
(table) => {
	return {
		rolePermissionsPermissionIdx: index("role_permissions_permission_index").using("btree", table.appId.asc().nullsLast(), table.permission.asc().nullsLast()),
		rolePermissionsRoleIdx: index("role_permissions_role_index").using("btree", table.appId.asc().nullsLast(), table.role.asc().nullsLast()),
		supertokensRolePermissionsRoleFkey: foreignKey({
			columns: [table.appId, table.role],
			foreignColumns: [supertokensRoles.appId, supertokensRoles.role],
			name: "supertokens_role_permissions_role_fkey"
		}).onDelete("cascade"),
		supertokensRolePermissionsPkey: primaryKey({ columns: [table.appId, table.role, table.permission], name: "supertokens_role_permissions_pkey"}),
	}
});

export const supertokensTenantFirstFactors = pgTable("supertokens_tenant_first_factors", {
	connectionUriDomain: varchar("connection_uri_domain", { length: 256 }).default('').notNull(),
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	factorId: varchar("factor_id", { length: 128 }).notNull(),
},
(table) => {
	return {
		tenantFirstFactorsTenantIdIdx: index("tenant_first_factors_tenant_id_index").using("btree", table.connectionUriDomain.asc().nullsLast(), table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		supertokensTenantFirstFactorsTenantIdFkey: foreignKey({
			columns: [table.connectionUriDomain, table.appId, table.tenantId],
			foreignColumns: [supertokensTenantConfigs.connectionUriDomain, supertokensTenantConfigs.appId, supertokensTenantConfigs.tenantId],
			name: "supertokens_tenant_first_factors_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensTenantFirstFactorsPkey: primaryKey({ columns: [table.connectionUriDomain, table.appId, table.tenantId, table.factorId], name: "supertokens_tenant_first_factors_pkey"}),
	}
});

export const supertokensTenantRequiredSecondaryFactors = pgTable("supertokens_tenant_required_secondary_factors", {
	connectionUriDomain: varchar("connection_uri_domain", { length: 256 }).default('').notNull(),
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	factorId: varchar("factor_id", { length: 128 }).notNull(),
},
(table) => {
	return {
		tenantDefaultRequiredFactorIdsTenantIdIdx: index("tenant_default_required_factor_ids_tenant_id_index").using("btree", table.connectionUriDomain.asc().nullsLast(), table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		supertokensTenantRequiredSecondaryFactorsTenantIdFkey: foreignKey({
			columns: [table.connectionUriDomain, table.appId, table.tenantId],
			foreignColumns: [supertokensTenantConfigs.connectionUriDomain, supertokensTenantConfigs.appId, supertokensTenantConfigs.tenantId],
			name: "supertokens_tenant_required_secondary_factors_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensTenantRequiredSecondaryFactorsPkey: primaryKey({ columns: [table.connectionUriDomain, table.appId, table.tenantId, table.factorId], name: "supertokens_tenant_required_secondary_factors_pkey"}),
	}
});

export const supertokensEmailpasswordUserToTenant = pgTable("supertokens_emailpassword_user_to_tenant", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
},
(table) => {
	return {
		supertokensEmailpasswordUserToTenantUserIdFkey: foreignKey({
			columns: [table.appId, table.tenantId, table.userId],
			foreignColumns: [supertokensAllAuthRecipeUsers.appId, supertokensAllAuthRecipeUsers.tenantId, supertokensAllAuthRecipeUsers.userId],
			name: "supertokens_emailpassword_user_to_tenant_user_id_fkey"
		}).onDelete("cascade"),
		supertokensEmailpasswordUserToTenantPkey: primaryKey({ columns: [table.appId, table.tenantId, table.userId], name: "supertokens_emailpassword_user_to_tenant_pkey"}),
		supertokensEmailpasswordUserToTenantEmailKey: unique("supertokens_emailpassword_user_to_tenant_email_key").on(table.appId, table.tenantId, table.email),
	}
});

export const supertokensUserRoles = pgTable("supertokens_user_roles", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	userId: varchar("user_id", { length: 128 }).notNull(),
	role: varchar("role", { length: 255 }).notNull(),
},
(table) => {
	return {
		userRolesAppIdRoleIdx: index("user_roles_app_id_role_index").using("btree", table.appId.asc().nullsLast(), table.role.asc().nullsLast()),
		userRolesRoleIdx: index("user_roles_role_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.role.asc().nullsLast()),
		userRolesTenantIdIdx: index("user_roles_tenant_id_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		supertokensUserRolesTenantIdFkey: foreignKey({
			columns: [table.appId, table.tenantId],
			foreignColumns: [supertokensTenants.appId, supertokensTenants.tenantId],
			name: "supertokens_user_roles_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensUserRolesPkey: primaryKey({ columns: [table.appId, table.tenantId, table.userId, table.role], name: "supertokens_user_roles_pkey"}),
	}
});

export const supertokensUseridMapping = pgTable("supertokens_userid_mapping", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	supertokensUserId: char("supertokens_user_id", { length: 36 }).notNull(),
	externalUserId: varchar("external_user_id", { length: 128 }).notNull(),
	externalUserIdInfo: text("external_user_id_info"),
},
(table) => {
	return {
		useridMappingSupertokensUserIdIdx: index("userid_mapping_supertokens_user_id_index").using("btree", table.appId.asc().nullsLast(), table.supertokensUserId.asc().nullsLast()),
		supertokensUseridMappingSupertokensUserIdFkey: foreignKey({
			columns: [table.appId, table.supertokensUserId],
			foreignColumns: [supertokensAppIdToUserId.appId, supertokensAppIdToUserId.userId],
			name: "supertokens_userid_mapping_supertokens_user_id_fkey"
		}).onDelete("cascade"),
		supertokensUseridMappingPkey: primaryKey({ columns: [table.appId, table.supertokensUserId, table.externalUserId], name: "supertokens_userid_mapping_pkey"}),
		supertokensUseridMappingSupertokensUserIdKey: unique("supertokens_userid_mapping_supertokens_user_id_key").on(table.appId, table.supertokensUserId),
		supertokensUseridMappingExternalUserIdKey: unique("supertokens_userid_mapping_external_user_id_key").on(table.appId, table.externalUserId),
	}
});

export const supertokensKeyValue = pgTable("supertokens_key_value", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	name: varchar("name", { length: 128 }).notNull(),
	value: text("value"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAtTime: bigint("created_at_time", { mode: "number" }),
},
(table) => {
	return {
		keyValueTenantIdIdx: index("key_value_tenant_id_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		supertokensKeyValueTenantIdFkey: foreignKey({
			columns: [table.appId, table.tenantId],
			foreignColumns: [supertokensTenants.appId, supertokensTenants.tenantId],
			name: "supertokens_key_value_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensKeyValuePkey: primaryKey({ columns: [table.appId, table.tenantId, table.name], name: "supertokens_key_value_pkey"}),
	}
});

export const supertokensAppIdToUserId = pgTable("supertokens_app_id_to_user_id", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	recipeId: varchar("recipe_id", { length: 128 }).notNull(),
	primaryOrRecipeUserId: char("primary_or_recipe_user_id", { length: 36 }).notNull(),
	isLinkedOrIsAPrimaryUser: boolean("is_linked_or_is_a_primary_user").default(false).notNull(),
},
(table) => {
	return {
		appIdToUserIdAppIdIdx: index("app_id_to_user_id_app_id_index").using("btree", table.appId.asc().nullsLast()),
		appIdToUserIdPrimaryUserIdIdx: index("app_id_to_user_id_primary_user_id_index").using("btree", table.primaryOrRecipeUserId.asc().nullsLast(), table.appId.asc().nullsLast()),
		supertokensAppIdToUserIdPrimaryOrRecipeUserIdFkey: foreignKey({
			columns: [table.appId, table.primaryOrRecipeUserId],
			foreignColumns: [table.appId, table.userId],
			name: "supertokens_app_id_to_user_id_primary_or_recipe_user_id_fkey"
		}).onDelete("cascade"),
		supertokensAppIdToUserIdAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_app_id_to_user_id_app_id_fkey"
		}).onDelete("cascade"),
		supertokensAppIdToUserIdPkey: primaryKey({ columns: [table.appId, table.userId], name: "supertokens_app_id_to_user_id_pkey"}),
	}
});

export const supertokensEmailpasswordUsers = pgTable("supertokens_emailpassword_users", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	passwordHash: varchar("password_hash", { length: 256 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timeJoined: bigint("time_joined", { mode: "number" }).notNull(),
},
(table) => {
	return {
		supertokensEmailpasswordUsersUserIdFkey: foreignKey({
			columns: [table.appId, table.userId],
			foreignColumns: [supertokensAppIdToUserId.appId, supertokensAppIdToUserId.userId],
			name: "supertokens_emailpassword_users_user_id_fkey"
		}).onDelete("cascade"),
		supertokensEmailpasswordUsersPkey: primaryKey({ columns: [table.appId, table.userId], name: "supertokens_emailpassword_users_pkey"}),
	}
});

export const supertokensEmailpasswordPswdResetTokens = pgTable("supertokens_emailpassword_pswd_reset_tokens", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	token: varchar("token", { length: 128 }).notNull(),
	email: varchar("email", { length: 256 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tokenExpiry: bigint("token_expiry", { mode: "number" }).notNull(),
},
(table) => {
	return {
		emailpasswordPasswordResetTokenExpiryIdx: index("emailpassword_password_reset_token_expiry_index").using("btree", table.tokenExpiry.asc().nullsLast()),
		emailpasswordPswdResetTokensUserIdIdx: index("emailpassword_pswd_reset_tokens_user_id_index").using("btree", table.appId.asc().nullsLast(), table.userId.asc().nullsLast()),
		supertokensEmailpasswordPswdResetTokensUserIdFkey: foreignKey({
			columns: [table.appId, table.userId],
			foreignColumns: [supertokensAppIdToUserId.appId, supertokensAppIdToUserId.userId],
			name: "supertokens_emailpassword_pswd_reset_tokens_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		supertokensEmailpasswordPswdResetTokensPkey: primaryKey({ columns: [table.appId, table.userId, table.token], name: "supertokens_emailpassword_pswd_reset_tokens_pkey"}),
		supertokensEmailpasswordPswdResetTokensTokenKey: unique("supertokens_emailpassword_pswd_reset_tokens_token_key").on(table.token),
	}
});

export const supertokensThirdpartyUserToTenant = pgTable("supertokens_thirdparty_user_to_tenant", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	thirdPartyId: varchar("third_party_id", { length: 28 }).notNull(),
	thirdPartyUserId: varchar("third_party_user_id", { length: 256 }).notNull(),
},
(table) => {
	return {
		supertokensThirdpartyUserToTenantUserIdFkey: foreignKey({
			columns: [table.appId, table.tenantId, table.userId],
			foreignColumns: [supertokensAllAuthRecipeUsers.appId, supertokensAllAuthRecipeUsers.tenantId, supertokensAllAuthRecipeUsers.userId],
			name: "supertokens_thirdparty_user_to_tenant_user_id_fkey"
		}).onDelete("cascade"),
		supertokensThirdpartyUserToTenantPkey: primaryKey({ columns: [table.appId, table.tenantId, table.userId], name: "supertokens_thirdparty_user_to_tenant_pkey"}),
		supertokensThirdpartyUserToTenantThirdPartyUserIdKey: unique("supertokens_thirdparty_user_to_tenant_third_party_user_id_key").on(table.appId, table.tenantId, table.thirdPartyId, table.thirdPartyUserId),
	}
});

export const supertokensJwtSigningKeys = pgTable("supertokens_jwt_signing_keys", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	keyId: varchar("key_id", { length: 255 }).notNull(),
	keyString: text("key_string").notNull(),
	algorithm: varchar("algorithm", { length: 10 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }),
},
(table) => {
	return {
		jwtSigningKeysAppIdIdx: index("jwt_signing_keys_app_id_index").using("btree", table.appId.asc().nullsLast()),
		supertokensJwtSigningKeysAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_jwt_signing_keys_app_id_fkey"
		}).onDelete("cascade"),
		supertokensJwtSigningKeysPkey: primaryKey({ columns: [table.appId, table.keyId], name: "supertokens_jwt_signing_keys_pkey"}),
	}
});

export const supertokensPasswordlessUsers = pgTable("supertokens_passwordless_users", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	email: varchar("email", { length: 256 }),
	phoneNumber: varchar("phone_number", { length: 256 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timeJoined: bigint("time_joined", { mode: "number" }).notNull(),
},
(table) => {
	return {
		supertokensPasswordlessUsersUserIdFkey: foreignKey({
			columns: [table.appId, table.userId],
			foreignColumns: [supertokensAppIdToUserId.appId, supertokensAppIdToUserId.userId],
			name: "supertokens_passwordless_users_user_id_fkey"
		}).onDelete("cascade"),
		supertokensPasswordlessUsersPkey: primaryKey({ columns: [table.appId, table.userId], name: "supertokens_passwordless_users_pkey"}),
	}
});

export const supertokensPasswordlessUserToTenant = pgTable("supertokens_passwordless_user_to_tenant", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	email: varchar("email", { length: 256 }),
	phoneNumber: varchar("phone_number", { length: 256 }),
},
(table) => {
	return {
		supertokensPasswordlessUserToTenantUserIdFkey: foreignKey({
			columns: [table.appId, table.tenantId, table.userId],
			foreignColumns: [supertokensAllAuthRecipeUsers.appId, supertokensAllAuthRecipeUsers.tenantId, supertokensAllAuthRecipeUsers.userId],
			name: "supertokens_passwordless_user_to_tenant_user_id_fkey"
		}).onDelete("cascade"),
		supertokensPasswordlessUserToTenantPkey: primaryKey({ columns: [table.appId, table.tenantId, table.userId], name: "supertokens_passwordless_user_to_tenant_pkey"}),
		supertokensPasswordlessUserToTenantEmailKey: unique("supertokens_passwordless_user_to_tenant_email_key").on(table.appId, table.tenantId, table.email),
		supertokensPasswordlessUserToTenantPhoneNumberKey: unique("supertokens_passwordless_user_to_tenant_phone_number_key").on(table.appId, table.tenantId, table.phoneNumber),
	}
});

export const supertokensDashboardUsers = pgTable("supertokens_dashboard_users", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	passwordHash: varchar("password_hash", { length: 256 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timeJoined: bigint("time_joined", { mode: "number" }).notNull(),
},
(table) => {
	return {
		dashboardUsersAppIdIdx: index("dashboard_users_app_id_index").using("btree", table.appId.asc().nullsLast()),
		supertokensDashboardUsersAppIdFkey: foreignKey({
			columns: [table.appId],
			foreignColumns: [supertokensApps.appId],
			name: "supertokens_dashboard_users_app_id_fkey"
		}).onDelete("cascade"),
		supertokensDashboardUsersPkey: primaryKey({ columns: [table.appId, table.userId], name: "supertokens_dashboard_users_pkey"}),
		supertokensDashboardUsersEmailKey: unique("supertokens_dashboard_users_email_key").on(table.appId, table.email),
	}
});

export const supertokensDashboardUserSessions = pgTable("supertokens_dashboard_user_sessions", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	sessionId: char("session_id", { length: 36 }).notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timeCreated: bigint("time_created", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiry: bigint("expiry", { mode: "number" }).notNull(),
},
(table) => {
	return {
		dashboardUserSessionsExpiryIdx: index("dashboard_user_sessions_expiry_index").using("btree", table.expiry.asc().nullsLast()),
		dashboardUserSessionsUserIdIdx: index("dashboard_user_sessions_user_id_index").using("btree", table.appId.asc().nullsLast(), table.userId.asc().nullsLast()),
		supertokensDashboardUserSessionsUserIdFkey: foreignKey({
			columns: [table.appId, table.userId],
			foreignColumns: [supertokensDashboardUsers.appId, supertokensDashboardUsers.userId],
			name: "supertokens_dashboard_user_sessions_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		supertokensDashboardUserSessionsPkey: primaryKey({ columns: [table.appId, table.sessionId], name: "supertokens_dashboard_user_sessions_pkey"}),
	}
});

export const supertokensEmailverificationTokens = pgTable("supertokens_emailverification_tokens", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	userId: varchar("user_id", { length: 128 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	token: varchar("token", { length: 128 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tokenExpiry: bigint("token_expiry", { mode: "number" }).notNull(),
},
(table) => {
	return {
		emailverificationTokensIdx: index("emailverification_tokens_index").using("btree", table.tokenExpiry.asc().nullsLast()),
		emailverificationTokensTenantIdIdx: index("emailverification_tokens_tenant_id_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		supertokensEmailverificationTokensTenantIdFkey: foreignKey({
			columns: [table.appId, table.tenantId],
			foreignColumns: [supertokensTenants.appId, supertokensTenants.tenantId],
			name: "supertokens_emailverification_tokens_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensEmailverificationTokensPkey: primaryKey({ columns: [table.appId, table.tenantId, table.userId, table.email, table.token], name: "supertokens_emailverification_tokens_pkey"}),
		supertokensEmailverificationTokensTokenKey: unique("supertokens_emailverification_tokens_token_key").on(table.token),
	}
});

export const supertokensThirdpartyUsers = pgTable("supertokens_thirdparty_users", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	thirdPartyId: varchar("third_party_id", { length: 28 }).notNull(),
	thirdPartyUserId: varchar("third_party_user_id", { length: 256 }).notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timeJoined: bigint("time_joined", { mode: "number" }).notNull(),
},
(table) => {
	return {
		thirdpartyUsersEmailIdx: index("thirdparty_users_email_index").using("btree", table.appId.asc().nullsLast(), table.email.asc().nullsLast()),
		thirdpartyUsersThirdpartyUserIdIdx: index("thirdparty_users_thirdparty_user_id_index").using("btree", table.appId.asc().nullsLast(), table.thirdPartyId.asc().nullsLast(), table.thirdPartyUserId.asc().nullsLast()),
		supertokensThirdpartyUsersUserIdFkey: foreignKey({
			columns: [table.appId, table.userId],
			foreignColumns: [supertokensAppIdToUserId.appId, supertokensAppIdToUserId.userId],
			name: "supertokens_thirdparty_users_user_id_fkey"
		}).onDelete("cascade"),
		supertokensThirdpartyUsersPkey: primaryKey({ columns: [table.appId, table.userId], name: "supertokens_thirdparty_users_pkey"}),
	}
});

export const supertokensPasswordlessCodes = pgTable("supertokens_passwordless_codes", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	codeId: char("code_id", { length: 36 }).notNull(),
	deviceIdHash: char("device_id_hash", { length: 44 }).notNull(),
	linkCodeHash: char("link_code_hash", { length: 44 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }).notNull(),
},
(table) => {
	return {
		passwordlessCodesCreatedAtIdx: index("passwordless_codes_created_at_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.createdAt.asc().nullsLast()),
		passwordlessCodesDeviceIdHashIdx: index("passwordless_codes_device_id_hash_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.deviceIdHash.asc().nullsLast()),
		supertokensPasswordlessCodesDeviceIdHashFkey: foreignKey({
			columns: [table.appId, table.tenantId, table.deviceIdHash],
			foreignColumns: [supertokensPasswordlessDevices.appId, supertokensPasswordlessDevices.tenantId, supertokensPasswordlessDevices.deviceIdHash],
			name: "supertokens_passwordless_codes_device_id_hash_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		supertokensPasswordlessCodesPkey: primaryKey({ columns: [table.appId, table.tenantId, table.codeId], name: "supertokens_passwordless_codes_pkey"}),
		supertokensPasswordlessCodesLinkCodeHashKey: unique("supertokens_passwordless_codes_link_code_hash_key").on(table.appId, table.tenantId, table.linkCodeHash),
	}
});

export const supertokensPasswordlessDevices = pgTable("supertokens_passwordless_devices", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	deviceIdHash: char("device_id_hash", { length: 44 }).notNull(),
	email: varchar("email", { length: 256 }),
	phoneNumber: varchar("phone_number", { length: 256 }),
	linkCodeSalt: char("link_code_salt", { length: 44 }).notNull(),
	failedAttempts: integer("failed_attempts").notNull(),
},
(table) => {
	return {
		passwordlessDevicesEmailIdx: index("passwordless_devices_email_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.email.asc().nullsLast()),
		passwordlessDevicesPhoneNumberIdx: index("passwordless_devices_phone_number_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.phoneNumber.asc().nullsLast()),
		passwordlessDevicesTenantIdIdx: index("passwordless_devices_tenant_id_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		supertokensPasswordlessDevicesTenantIdFkey: foreignKey({
			columns: [table.appId, table.tenantId],
			foreignColumns: [supertokensTenants.appId, supertokensTenants.tenantId],
			name: "supertokens_passwordless_devices_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensPasswordlessDevicesPkey: primaryKey({ columns: [table.appId, table.tenantId, table.deviceIdHash], name: "supertokens_passwordless_devices_pkey"}),
	}
});

export const supertokensTotpUsedCodes = pgTable("supertokens_totp_used_codes", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	userId: varchar("user_id", { length: 128 }).notNull(),
	code: varchar("code", { length: 8 }).notNull(),
	isValid: boolean("is_valid").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiryTimeMs: bigint("expiry_time_ms", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdTimeMs: bigint("created_time_ms", { mode: "number" }).notNull(),
},
(table) => {
	return {
		totpUsedCodesExpiryTimeMsIdx: index("totp_used_codes_expiry_time_ms_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.expiryTimeMs.asc().nullsLast()),
		totpUsedCodesTenantIdIdx: index("totp_used_codes_tenant_id_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		totpUsedCodesUserIdIdx: index("totp_used_codes_user_id_index").using("btree", table.appId.asc().nullsLast(), table.userId.asc().nullsLast()),
		supertokensTotpUsedCodesUserIdFkey: foreignKey({
			columns: [table.appId, table.userId],
			foreignColumns: [supertokensTotpUsers.appId, supertokensTotpUsers.userId],
			name: "supertokens_totp_used_codes_user_id_fkey"
		}).onDelete("cascade"),
		supertokensTotpUsedCodesTenantIdFkey: foreignKey({
			columns: [table.appId, table.tenantId],
			foreignColumns: [supertokensTenants.appId, supertokensTenants.tenantId],
			name: "supertokens_totp_used_codes_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensTotpUsedCodesPkey: primaryKey({ columns: [table.appId, table.tenantId, table.userId, table.createdTimeMs], name: "supertokens_totp_used_codes_pkey"}),
	}
});

export const supertokensAllAuthRecipeUsers = pgTable("supertokens_all_auth_recipe_users", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	userId: char("user_id", { length: 36 }).notNull(),
	primaryOrRecipeUserId: char("primary_or_recipe_user_id", { length: 36 }).notNull(),
	isLinkedOrIsAPrimaryUser: boolean("is_linked_or_is_a_primary_user").default(false).notNull(),
	recipeId: varchar("recipe_id", { length: 128 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timeJoined: bigint("time_joined", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	primaryOrRecipeUserTimeJoined: bigint("primary_or_recipe_user_time_joined", { mode: "number" }).notNull(),
},
(table) => {
	return {
		allAuthRecipeTenantIdIdx: index("all_auth_recipe_tenant_id_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		allAuthRecipeUserIdIdx: index("all_auth_recipe_user_id_index").using("btree", table.appId.asc().nullsLast(), table.userId.asc().nullsLast()),
		allAuthRecipeUsersPaginationIndex1: index("all_auth_recipe_users_pagination_index1").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.primaryOrRecipeUserTimeJoined.desc().nullsFirst(), table.primaryOrRecipeUserId.desc().nullsFirst()),
		allAuthRecipeUsersPaginationIndex2: index("all_auth_recipe_users_pagination_index2").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.primaryOrRecipeUserTimeJoined.asc().nullsLast(), table.primaryOrRecipeUserId.desc().nullsFirst()),
		allAuthRecipeUsersPaginationIndex3: index("all_auth_recipe_users_pagination_index3").using("btree", table.recipeId.asc().nullsLast(), table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.primaryOrRecipeUserTimeJoined.desc().nullsFirst(), table.primaryOrRecipeUserId.desc().nullsFirst()),
		allAuthRecipeUsersPaginationIndex4: index("all_auth_recipe_users_pagination_index4").using("btree", table.recipeId.asc().nullsLast(), table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.primaryOrRecipeUserTimeJoined.asc().nullsLast(), table.primaryOrRecipeUserId.desc().nullsFirst()),
		allAuthRecipeUsersPrimaryUserIdIdx: index("all_auth_recipe_users_primary_user_id_index").using("btree", table.primaryOrRecipeUserId.asc().nullsLast(), table.appId.asc().nullsLast()),
		allAuthRecipeUsersRecipeIdIdx: index("all_auth_recipe_users_recipe_id_index").using("btree", table.appId.asc().nullsLast(), table.recipeId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		supertokensAllAuthRecipeUsersTenantIdFkey: foreignKey({
			columns: [table.appId, table.tenantId],
			foreignColumns: [supertokensTenants.appId, supertokensTenants.tenantId],
			name: "supertokens_all_auth_recipe_users_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensAllAuthRecipeUsersPrimaryOrRecipeUserIdFke: foreignKey({
			columns: [table.appId, table.primaryOrRecipeUserId],
			foreignColumns: [supertokensAppIdToUserId.appId, supertokensAppIdToUserId.userId],
			name: "supertokens_all_auth_recipe_users_primary_or_recipe_user_id_fke"
		}).onDelete("cascade"),
		supertokensAllAuthRecipeUsersUserIdFkey: foreignKey({
			columns: [table.appId, table.userId],
			foreignColumns: [supertokensAppIdToUserId.appId, supertokensAppIdToUserId.userId],
			name: "supertokens_all_auth_recipe_users_user_id_fkey"
		}).onDelete("cascade"),
		supertokensAllAuthRecipeUsersPkey: primaryKey({ columns: [table.appId, table.tenantId, table.userId], name: "supertokens_all_auth_recipe_users_pkey"}),
	}
});

export const supertokensTenantConfigs = pgTable("supertokens_tenant_configs", {
	connectionUriDomain: varchar("connection_uri_domain", { length: 256 }).default('').notNull(),
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	coreConfig: text("core_config"),
	emailPasswordEnabled: boolean("email_password_enabled"),
	passwordlessEnabled: boolean("passwordless_enabled"),
	thirdPartyEnabled: boolean("third_party_enabled"),
	isFirstFactorsNull: boolean("is_first_factors_null"),
},
(table) => {
	return {
		supertokensTenantConfigsPkey: primaryKey({ columns: [table.connectionUriDomain, table.appId, table.tenantId], name: "supertokens_tenant_configs_pkey"}),
	}
});

export const supertokensTotpUserDevices = pgTable("supertokens_totp_user_devices", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	userId: varchar("user_id", { length: 128 }).notNull(),
	deviceName: varchar("device_name", { length: 256 }).notNull(),
	secretKey: varchar("secret_key", { length: 256 }).notNull(),
	period: integer("period").notNull(),
	skew: integer("skew").notNull(),
	verified: boolean("verified").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }),
},
(table) => {
	return {
		totpUserDevicesUserIdIdx: index("totp_user_devices_user_id_index").using("btree", table.appId.asc().nullsLast(), table.userId.asc().nullsLast()),
		supertokensTotpUserDevicesUserIdFkey: foreignKey({
			columns: [table.appId, table.userId],
			foreignColumns: [supertokensTotpUsers.appId, supertokensTotpUsers.userId],
			name: "supertokens_totp_user_devices_user_id_fkey"
		}).onDelete("cascade"),
		supertokensTotpUserDevicesPkey: primaryKey({ columns: [table.appId, table.userId, table.deviceName], name: "supertokens_totp_user_devices_pkey"}),
	}
});

export const supertokensSessionInfo = pgTable("supertokens_session_info", {
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	sessionHandle: varchar("session_handle", { length: 255 }).notNull(),
	userId: varchar("user_id", { length: 128 }).notNull(),
	refreshTokenHash2: varchar("refresh_token_hash_2", { length: 128 }).notNull(),
	sessionData: text("session_data"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAtTime: bigint("created_at_time", { mode: "number" }).notNull(),
	jwtUserPayload: text("jwt_user_payload"),
	useStaticKey: boolean("use_static_key").notNull(),
},
(table) => {
	return {
		sessionExpiryIdx: index("session_expiry_index").using("btree", table.expiresAt.asc().nullsLast()),
		sessionInfoTenantIdIdx: index("session_info_tenant_id_index").using("btree", table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		supertokensSessionInfoTenantIdFkey: foreignKey({
			columns: [table.appId, table.tenantId],
			foreignColumns: [supertokensTenants.appId, supertokensTenants.tenantId],
			name: "supertokens_session_info_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensSessionInfoPkey: primaryKey({ columns: [table.appId, table.tenantId, table.sessionHandle], name: "supertokens_session_info_pkey"}),
	}
});

export const supertokensTenantThirdpartyProviderClients = pgTable("supertokens_tenant_thirdparty_provider_clients", {
	connectionUriDomain: varchar("connection_uri_domain", { length: 256 }).default('').notNull(),
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	thirdPartyId: varchar("third_party_id", { length: 28 }).notNull(),
	clientType: varchar("client_type", { length: 64 }).default('').notNull(),
	clientId: varchar("client_id", { length: 256 }).notNull(),
	clientSecret: text("client_secret"),
	scope: varchar("scope", { length: 128 }).array(),
	forcePkce: boolean("force_pkce"),
	additionalConfig: text("additional_config"),
},
(table) => {
	return {
		tenantThirdpartyProviderClientsThirdPartyIdIdx: index("tenant_thirdparty_provider_clients_third_party_id_index").using("btree", table.connectionUriDomain.asc().nullsLast(), table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast(), table.thirdPartyId.asc().nullsLast()),
		supertokensTenantThirdpartyProviderClientsThirdPartyIdF: foreignKey({
			columns: [table.connectionUriDomain, table.appId, table.tenantId, table.thirdPartyId],
			foreignColumns: [supertokensTenantThirdpartyProviders.connectionUriDomain, supertokensTenantThirdpartyProviders.appId, supertokensTenantThirdpartyProviders.tenantId, supertokensTenantThirdpartyProviders.thirdPartyId],
			name: "supertokens_tenant_thirdparty_provider_clients_third_party_id_f"
		}).onDelete("cascade"),
		supertokensTenantThirdpartyProviderClientsPkey: primaryKey({ columns: [table.connectionUriDomain, table.appId, table.tenantId, table.thirdPartyId, table.clientType], name: "supertokens_tenant_thirdparty_provider_clients_pkey"}),
	}
});

export const supertokensTenantThirdpartyProviders = pgTable("supertokens_tenant_thirdparty_providers", {
	connectionUriDomain: varchar("connection_uri_domain", { length: 256 }).default('').notNull(),
	appId: varchar("app_id", { length: 64 }).default('public').notNull(),
	tenantId: varchar("tenant_id", { length: 64 }).default('public').notNull(),
	thirdPartyId: varchar("third_party_id", { length: 28 }).notNull(),
	name: varchar("name", { length: 64 }),
	authorizationEndpoint: text("authorization_endpoint"),
	authorizationEndpointQueryParams: text("authorization_endpoint_query_params"),
	tokenEndpoint: text("token_endpoint"),
	tokenEndpointBodyParams: text("token_endpoint_body_params"),
	userInfoEndpoint: text("user_info_endpoint"),
	userInfoEndpointQueryParams: text("user_info_endpoint_query_params"),
	userInfoEndpointHeaders: text("user_info_endpoint_headers"),
	jwksUri: text("jwks_uri"),
	oidcDiscoveryEndpoint: text("oidc_discovery_endpoint"),
	requireEmail: boolean("require_email"),
	userInfoMapFromIdTokenPayloadUserId: varchar("user_info_map_from_id_token_payload_user_id", { length: 64 }),
	userInfoMapFromIdTokenPayloadEmail: varchar("user_info_map_from_id_token_payload_email", { length: 64 }),
	userInfoMapFromIdTokenPayloadEmailVerified: varchar("user_info_map_from_id_token_payload_email_verified", { length: 64 }),
	userInfoMapFromUserInfoEndpointUserId: varchar("user_info_map_from_user_info_endpoint_user_id", { length: 64 }),
	userInfoMapFromUserInfoEndpointEmail: varchar("user_info_map_from_user_info_endpoint_email", { length: 64 }),
	userInfoMapFromUserInfoEndpointEmailVerified: varchar("user_info_map_from_user_info_endpoint_email_verified", { length: 64 }),
},
(table) => {
	return {
		tenantThirdpartyProvidersTenantIdIdx: index("tenant_thirdparty_providers_tenant_id_index").using("btree", table.connectionUriDomain.asc().nullsLast(), table.appId.asc().nullsLast(), table.tenantId.asc().nullsLast()),
		supertokensTenantThirdpartyProvidersTenantIdFkey: foreignKey({
			columns: [table.connectionUriDomain, table.appId, table.tenantId],
			foreignColumns: [supertokensTenantConfigs.connectionUriDomain, supertokensTenantConfigs.appId, supertokensTenantConfigs.tenantId],
			name: "supertokens_tenant_thirdparty_providers_tenant_id_fkey"
		}).onDelete("cascade"),
		supertokensTenantThirdpartyProvidersPkey: primaryKey({ columns: [table.connectionUriDomain, table.appId, table.tenantId, table.thirdPartyId], name: "supertokens_tenant_thirdparty_providers_pkey"}),
	}
});