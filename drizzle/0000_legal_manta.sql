-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "supertokens_apps" (
	"app_id" varchar(64) PRIMARY KEY DEFAULT 'public' NOT NULL,
	"created_at_time" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" char(36) PRIMARY KEY NOT NULL,
	"username" char(50) NOT NULL,
	"last_selected_level" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"user_id" char(36) NOT NULL,
	"element_id" integer NOT NULL,
	"current_srs_stage" integer DEFAULT 1 NOT NULL,
	"unlock_date" TIMESTAMP,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"prompts" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" char(36) NOT NULL,
	"guess_kanji" boolean DEFAULT true NOT NULL,
	"multichoice_input" boolean DEFAULT true NOT NULL,
	"quick_mode" boolean DEFAULT false NOT NULL,
	"focus_mode_enabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_reviews_active" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" char(36) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" TIMESTAMP,
	"prompt_ids" varchar(24)[],
	"guess_kanji" boolean,
	"multichoice_input" boolean,
	"total_correct" integer DEFAULT 0,
	"total_answers" integer DEFAULT 0,
	"wrong_answers_ids" varchar(24)[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_roles" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"role" varchar(255) NOT NULL,
	CONSTRAINT "supertokens_roles_pkey" PRIMARY KEY("app_id","role")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_totp_users" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" varchar(128) NOT NULL,
	CONSTRAINT "supertokens_totp_users_pkey" PRIMARY KEY("app_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_tenants" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"created_at_time" bigint,
	CONSTRAINT "supertokens_tenants_pkey" PRIMARY KEY("app_id","tenant_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_user_last_active" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"last_active_time" bigint,
	CONSTRAINT "supertokens_user_last_active_pkey" PRIMARY KEY("app_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_session_access_token_signing_keys" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"created_at_time" bigint NOT NULL,
	"value" text,
	CONSTRAINT "supertokens_session_access_token_signing_keys_pkey" PRIMARY KEY("app_id","created_at_time")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_emailverification_verified_emails" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"email" varchar(256) NOT NULL,
	CONSTRAINT "supertokens_emailverification_verified_emails_pkey" PRIMARY KEY("app_id","user_id","email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_user_metadata" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"user_metadata" text NOT NULL,
	CONSTRAINT "supertokens_user_metadata_pkey" PRIMARY KEY("app_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_role_permissions" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"role" varchar(255) NOT NULL,
	"permission" varchar(255) NOT NULL,
	CONSTRAINT "supertokens_role_permissions_pkey" PRIMARY KEY("app_id","role","permission")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_tenant_first_factors" (
	"connection_uri_domain" varchar(256) DEFAULT '' NOT NULL,
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"factor_id" varchar(128) NOT NULL,
	CONSTRAINT "supertokens_tenant_first_factors_pkey" PRIMARY KEY("connection_uri_domain","app_id","tenant_id","factor_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_tenant_required_secondary_factors" (
	"connection_uri_domain" varchar(256) DEFAULT '' NOT NULL,
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"factor_id" varchar(128) NOT NULL,
	CONSTRAINT "supertokens_tenant_required_secondary_factors_pkey" PRIMARY KEY("connection_uri_domain","app_id","tenant_id","factor_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_emailpassword_user_to_tenant" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" char(36) NOT NULL,
	"email" varchar(256) NOT NULL,
	CONSTRAINT "supertokens_emailpassword_user_to_tenant_pkey" PRIMARY KEY("app_id","tenant_id","user_id"),
	CONSTRAINT "supertokens_emailpassword_user_to_tenant_email_key" UNIQUE("app_id","tenant_id","email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_user_roles" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"role" varchar(255) NOT NULL,
	CONSTRAINT "supertokens_user_roles_pkey" PRIMARY KEY("app_id","tenant_id","user_id","role")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_userid_mapping" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"supertokens_user_id" char(36) NOT NULL,
	"external_user_id" varchar(128) NOT NULL,
	"external_user_id_info" text,
	CONSTRAINT "supertokens_userid_mapping_pkey" PRIMARY KEY("app_id","supertokens_user_id","external_user_id"),
	CONSTRAINT "supertokens_userid_mapping_supertokens_user_id_key" UNIQUE("app_id","supertokens_user_id"),
	CONSTRAINT "supertokens_userid_mapping_external_user_id_key" UNIQUE("app_id","external_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_key_value" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"name" varchar(128) NOT NULL,
	"value" text,
	"created_at_time" bigint,
	CONSTRAINT "supertokens_key_value_pkey" PRIMARY KEY("app_id","tenant_id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_app_id_to_user_id" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" char(36) NOT NULL,
	"recipe_id" varchar(128) NOT NULL,
	"primary_or_recipe_user_id" char(36) NOT NULL,
	"is_linked_or_is_a_primary_user" boolean DEFAULT false NOT NULL,
	CONSTRAINT "supertokens_app_id_to_user_id_pkey" PRIMARY KEY("app_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_emailpassword_users" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" char(36) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password_hash" varchar(256) NOT NULL,
	"time_joined" bigint NOT NULL,
	CONSTRAINT "supertokens_emailpassword_users_pkey" PRIMARY KEY("app_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_emailpassword_pswd_reset_tokens" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" char(36) NOT NULL,
	"token" varchar(128) NOT NULL,
	"email" varchar(256),
	"token_expiry" bigint NOT NULL,
	CONSTRAINT "supertokens_emailpassword_pswd_reset_tokens_pkey" PRIMARY KEY("app_id","user_id","token"),
	CONSTRAINT "supertokens_emailpassword_pswd_reset_tokens_token_key" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_thirdparty_user_to_tenant" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" char(36) NOT NULL,
	"third_party_id" varchar(28) NOT NULL,
	"third_party_user_id" varchar(256) NOT NULL,
	CONSTRAINT "supertokens_thirdparty_user_to_tenant_pkey" PRIMARY KEY("app_id","tenant_id","user_id"),
	CONSTRAINT "supertokens_thirdparty_user_to_tenant_third_party_user_id_key" UNIQUE("app_id","tenant_id","third_party_id","third_party_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_jwt_signing_keys" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"key_id" varchar(255) NOT NULL,
	"key_string" text NOT NULL,
	"algorithm" varchar(10) NOT NULL,
	"created_at" bigint,
	CONSTRAINT "supertokens_jwt_signing_keys_pkey" PRIMARY KEY("app_id","key_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_passwordless_users" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" char(36) NOT NULL,
	"email" varchar(256),
	"phone_number" varchar(256),
	"time_joined" bigint NOT NULL,
	CONSTRAINT "supertokens_passwordless_users_pkey" PRIMARY KEY("app_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_passwordless_user_to_tenant" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" char(36) NOT NULL,
	"email" varchar(256),
	"phone_number" varchar(256),
	CONSTRAINT "supertokens_passwordless_user_to_tenant_pkey" PRIMARY KEY("app_id","tenant_id","user_id"),
	CONSTRAINT "supertokens_passwordless_user_to_tenant_email_key" UNIQUE("app_id","tenant_id","email"),
	CONSTRAINT "supertokens_passwordless_user_to_tenant_phone_number_key" UNIQUE("app_id","tenant_id","phone_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_dashboard_users" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" char(36) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password_hash" varchar(256) NOT NULL,
	"time_joined" bigint NOT NULL,
	CONSTRAINT "supertokens_dashboard_users_pkey" PRIMARY KEY("app_id","user_id"),
	CONSTRAINT "supertokens_dashboard_users_email_key" UNIQUE("app_id","email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_dashboard_user_sessions" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"session_id" char(36) NOT NULL,
	"user_id" char(36) NOT NULL,
	"time_created" bigint NOT NULL,
	"expiry" bigint NOT NULL,
	CONSTRAINT "supertokens_dashboard_user_sessions_pkey" PRIMARY KEY("app_id","session_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_emailverification_tokens" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"email" varchar(256) NOT NULL,
	"token" varchar(128) NOT NULL,
	"token_expiry" bigint NOT NULL,
	CONSTRAINT "supertokens_emailverification_tokens_pkey" PRIMARY KEY("app_id","tenant_id","user_id","email","token"),
	CONSTRAINT "supertokens_emailverification_tokens_token_key" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_thirdparty_users" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"third_party_id" varchar(28) NOT NULL,
	"third_party_user_id" varchar(256) NOT NULL,
	"user_id" char(36) NOT NULL,
	"email" varchar(256) NOT NULL,
	"time_joined" bigint NOT NULL,
	CONSTRAINT "supertokens_thirdparty_users_pkey" PRIMARY KEY("app_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_passwordless_codes" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"code_id" char(36) NOT NULL,
	"device_id_hash" char(44) NOT NULL,
	"link_code_hash" char(44) NOT NULL,
	"created_at" bigint NOT NULL,
	CONSTRAINT "supertokens_passwordless_codes_pkey" PRIMARY KEY("app_id","tenant_id","code_id"),
	CONSTRAINT "supertokens_passwordless_codes_link_code_hash_key" UNIQUE("app_id","tenant_id","link_code_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_passwordless_devices" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"device_id_hash" char(44) NOT NULL,
	"email" varchar(256),
	"phone_number" varchar(256),
	"link_code_salt" char(44) NOT NULL,
	"failed_attempts" integer NOT NULL,
	CONSTRAINT "supertokens_passwordless_devices_pkey" PRIMARY KEY("app_id","tenant_id","device_id_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_totp_used_codes" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"code" varchar(8) NOT NULL,
	"is_valid" boolean NOT NULL,
	"expiry_time_ms" bigint NOT NULL,
	"created_time_ms" bigint NOT NULL,
	CONSTRAINT "supertokens_totp_used_codes_pkey" PRIMARY KEY("app_id","tenant_id","user_id","created_time_ms")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_all_auth_recipe_users" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" char(36) NOT NULL,
	"primary_or_recipe_user_id" char(36) NOT NULL,
	"is_linked_or_is_a_primary_user" boolean DEFAULT false NOT NULL,
	"recipe_id" varchar(128) NOT NULL,
	"time_joined" bigint NOT NULL,
	"primary_or_recipe_user_time_joined" bigint NOT NULL,
	CONSTRAINT "supertokens_all_auth_recipe_users_pkey" PRIMARY KEY("app_id","tenant_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_tenant_configs" (
	"connection_uri_domain" varchar(256) DEFAULT '' NOT NULL,
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"core_config" text,
	"email_password_enabled" boolean,
	"passwordless_enabled" boolean,
	"third_party_enabled" boolean,
	"is_first_factors_null" boolean,
	CONSTRAINT "supertokens_tenant_configs_pkey" PRIMARY KEY("connection_uri_domain","app_id","tenant_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_totp_user_devices" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"device_name" varchar(256) NOT NULL,
	"secret_key" varchar(256) NOT NULL,
	"period" integer NOT NULL,
	"skew" integer NOT NULL,
	"verified" boolean NOT NULL,
	"created_at" bigint,
	CONSTRAINT "supertokens_totp_user_devices_pkey" PRIMARY KEY("app_id","user_id","device_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_session_info" (
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"session_handle" varchar(255) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"refresh_token_hash_2" varchar(128) NOT NULL,
	"session_data" text,
	"expires_at" bigint NOT NULL,
	"created_at_time" bigint NOT NULL,
	"jwt_user_payload" text,
	"use_static_key" boolean NOT NULL,
	CONSTRAINT "supertokens_session_info_pkey" PRIMARY KEY("app_id","tenant_id","session_handle")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_tenant_thirdparty_provider_clients" (
	"connection_uri_domain" varchar(256) DEFAULT '' NOT NULL,
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"third_party_id" varchar(28) NOT NULL,
	"client_type" varchar(64) DEFAULT '' NOT NULL,
	"client_id" varchar(256) NOT NULL,
	"client_secret" text,
	"scope" varchar(128)[],
	"force_pkce" boolean,
	"additional_config" text,
	CONSTRAINT "supertokens_tenant_thirdparty_provider_clients_pkey" PRIMARY KEY("connection_uri_domain","app_id","tenant_id","third_party_id","client_type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supertokens_tenant_thirdparty_providers" (
	"connection_uri_domain" varchar(256) DEFAULT '' NOT NULL,
	"app_id" varchar(64) DEFAULT 'public' NOT NULL,
	"tenant_id" varchar(64) DEFAULT 'public' NOT NULL,
	"third_party_id" varchar(28) NOT NULL,
	"name" varchar(64),
	"authorization_endpoint" text,
	"authorization_endpoint_query_params" text,
	"token_endpoint" text,
	"token_endpoint_body_params" text,
	"user_info_endpoint" text,
	"user_info_endpoint_query_params" text,
	"user_info_endpoint_headers" text,
	"jwks_uri" text,
	"oidc_discovery_endpoint" text,
	"require_email" boolean,
	"user_info_map_from_id_token_payload_user_id" varchar(64),
	"user_info_map_from_id_token_payload_email" varchar(64),
	"user_info_map_from_id_token_payload_email_verified" varchar(64),
	"user_info_map_from_user_info_endpoint_user_id" varchar(64),
	"user_info_map_from_user_info_endpoint_email" varchar(64),
	"user_info_map_from_user_info_endpoint_email_verified" varchar(64),
	CONSTRAINT "supertokens_tenant_thirdparty_providers_pkey" PRIMARY KEY("connection_uri_domain","app_id","tenant_id","third_party_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_roles" ADD CONSTRAINT "supertokens_roles_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_totp_users" ADD CONSTRAINT "supertokens_totp_users_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_tenants" ADD CONSTRAINT "supertokens_tenants_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_user_last_active" ADD CONSTRAINT "supertokens_user_last_active_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_session_access_token_signing_keys" ADD CONSTRAINT "supertokens_session_access_token_signing_keys_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_emailverification_verified_emails" ADD CONSTRAINT "supertokens_emailverification_verified_emails_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_user_metadata" ADD CONSTRAINT "supertokens_user_metadata_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_role_permissions" ADD CONSTRAINT "supertokens_role_permissions_role_fkey" FOREIGN KEY ("app_id","role") REFERENCES "public"."supertokens_roles"("app_id","role") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_tenant_first_factors" ADD CONSTRAINT "supertokens_tenant_first_factors_tenant_id_fkey" FOREIGN KEY ("connection_uri_domain","app_id","tenant_id") REFERENCES "public"."supertokens_tenant_configs"("connection_uri_domain","app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_tenant_required_secondary_factors" ADD CONSTRAINT "supertokens_tenant_required_secondary_factors_tenant_id_fkey" FOREIGN KEY ("connection_uri_domain","app_id","tenant_id") REFERENCES "public"."supertokens_tenant_configs"("connection_uri_domain","app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_emailpassword_user_to_tenant" ADD CONSTRAINT "supertokens_emailpassword_user_to_tenant_user_id_fkey" FOREIGN KEY ("app_id","tenant_id","user_id") REFERENCES "public"."supertokens_all_auth_recipe_users"("app_id","tenant_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_user_roles" ADD CONSTRAINT "supertokens_user_roles_tenant_id_fkey" FOREIGN KEY ("app_id","tenant_id") REFERENCES "public"."supertokens_tenants"("app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_userid_mapping" ADD CONSTRAINT "supertokens_userid_mapping_supertokens_user_id_fkey" FOREIGN KEY ("app_id","supertokens_user_id") REFERENCES "public"."supertokens_app_id_to_user_id"("app_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_key_value" ADD CONSTRAINT "supertokens_key_value_tenant_id_fkey" FOREIGN KEY ("app_id","tenant_id") REFERENCES "public"."supertokens_tenants"("app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_app_id_to_user_id" ADD CONSTRAINT "supertokens_app_id_to_user_id_primary_or_recipe_user_id_fkey" FOREIGN KEY ("app_id","primary_or_recipe_user_id") REFERENCES "public"."supertokens_app_id_to_user_id"("app_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_app_id_to_user_id" ADD CONSTRAINT "supertokens_app_id_to_user_id_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_emailpassword_users" ADD CONSTRAINT "supertokens_emailpassword_users_user_id_fkey" FOREIGN KEY ("app_id","user_id") REFERENCES "public"."supertokens_app_id_to_user_id"("app_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_emailpassword_pswd_reset_tokens" ADD CONSTRAINT "supertokens_emailpassword_pswd_reset_tokens_user_id_fkey" FOREIGN KEY ("app_id","user_id") REFERENCES "public"."supertokens_app_id_to_user_id"("app_id","user_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_thirdparty_user_to_tenant" ADD CONSTRAINT "supertokens_thirdparty_user_to_tenant_user_id_fkey" FOREIGN KEY ("app_id","tenant_id","user_id") REFERENCES "public"."supertokens_all_auth_recipe_users"("app_id","tenant_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_jwt_signing_keys" ADD CONSTRAINT "supertokens_jwt_signing_keys_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_passwordless_users" ADD CONSTRAINT "supertokens_passwordless_users_user_id_fkey" FOREIGN KEY ("app_id","user_id") REFERENCES "public"."supertokens_app_id_to_user_id"("app_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_passwordless_user_to_tenant" ADD CONSTRAINT "supertokens_passwordless_user_to_tenant_user_id_fkey" FOREIGN KEY ("app_id","tenant_id","user_id") REFERENCES "public"."supertokens_all_auth_recipe_users"("app_id","tenant_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_dashboard_users" ADD CONSTRAINT "supertokens_dashboard_users_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."supertokens_apps"("app_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_dashboard_user_sessions" ADD CONSTRAINT "supertokens_dashboard_user_sessions_user_id_fkey" FOREIGN KEY ("app_id","user_id") REFERENCES "public"."supertokens_dashboard_users"("app_id","user_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_emailverification_tokens" ADD CONSTRAINT "supertokens_emailverification_tokens_tenant_id_fkey" FOREIGN KEY ("app_id","tenant_id") REFERENCES "public"."supertokens_tenants"("app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_thirdparty_users" ADD CONSTRAINT "supertokens_thirdparty_users_user_id_fkey" FOREIGN KEY ("app_id","user_id") REFERENCES "public"."supertokens_app_id_to_user_id"("app_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_passwordless_codes" ADD CONSTRAINT "supertokens_passwordless_codes_device_id_hash_fkey" FOREIGN KEY ("app_id","tenant_id","device_id_hash") REFERENCES "public"."supertokens_passwordless_devices"("app_id","tenant_id","device_id_hash") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_passwordless_devices" ADD CONSTRAINT "supertokens_passwordless_devices_tenant_id_fkey" FOREIGN KEY ("app_id","tenant_id") REFERENCES "public"."supertokens_tenants"("app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_totp_used_codes" ADD CONSTRAINT "supertokens_totp_used_codes_user_id_fkey" FOREIGN KEY ("app_id","user_id") REFERENCES "public"."supertokens_totp_users"("app_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_totp_used_codes" ADD CONSTRAINT "supertokens_totp_used_codes_tenant_id_fkey" FOREIGN KEY ("app_id","tenant_id") REFERENCES "public"."supertokens_tenants"("app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_all_auth_recipe_users" ADD CONSTRAINT "supertokens_all_auth_recipe_users_tenant_id_fkey" FOREIGN KEY ("app_id","tenant_id") REFERENCES "public"."supertokens_tenants"("app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_all_auth_recipe_users" ADD CONSTRAINT "supertokens_all_auth_recipe_users_primary_or_recipe_user_id_fke" FOREIGN KEY ("app_id","primary_or_recipe_user_id") REFERENCES "public"."supertokens_app_id_to_user_id"("app_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_all_auth_recipe_users" ADD CONSTRAINT "supertokens_all_auth_recipe_users_user_id_fkey" FOREIGN KEY ("app_id","user_id") REFERENCES "public"."supertokens_app_id_to_user_id"("app_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_totp_user_devices" ADD CONSTRAINT "supertokens_totp_user_devices_user_id_fkey" FOREIGN KEY ("app_id","user_id") REFERENCES "public"."supertokens_totp_users"("app_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_session_info" ADD CONSTRAINT "supertokens_session_info_tenant_id_fkey" FOREIGN KEY ("app_id","tenant_id") REFERENCES "public"."supertokens_tenants"("app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_tenant_thirdparty_provider_clients" ADD CONSTRAINT "supertokens_tenant_thirdparty_provider_clients_third_party_id_f" FOREIGN KEY ("connection_uri_domain","app_id","tenant_id","third_party_id") REFERENCES "public"."supertokens_tenant_thirdparty_providers"("connection_uri_domain","app_id","tenant_id","third_party_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supertokens_tenant_thirdparty_providers" ADD CONSTRAINT "supertokens_tenant_thirdparty_providers_tenant_id_fkey" FOREIGN KEY ("connection_uri_domain","app_id","tenant_id") REFERENCES "public"."supertokens_tenant_configs"("connection_uri_domain","app_id","tenant_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "roles_app_id_index" ON "supertokens_roles" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "totp_users_app_id_index" ON "supertokens_totp_users" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenants_app_id_index" ON "supertokens_tenants" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_last_active_app_id_index" ON "supertokens_user_last_active" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "access_token_signing_keys_app_id_index" ON "supertokens_session_access_token_signing_keys" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emailverification_verified_emails_app_id_index" ON "supertokens_emailverification_verified_emails" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_metadata_app_id_index" ON "supertokens_user_metadata" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "role_permissions_permission_index" ON "supertokens_role_permissions" USING btree ("app_id","permission");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "role_permissions_role_index" ON "supertokens_role_permissions" USING btree ("app_id","role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_first_factors_tenant_id_index" ON "supertokens_tenant_first_factors" USING btree ("connection_uri_domain","app_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_default_required_factor_ids_tenant_id_index" ON "supertokens_tenant_required_secondary_factors" USING btree ("connection_uri_domain","app_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_roles_app_id_role_index" ON "supertokens_user_roles" USING btree ("app_id","role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_roles_role_index" ON "supertokens_user_roles" USING btree ("app_id","tenant_id","role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_roles_tenant_id_index" ON "supertokens_user_roles" USING btree ("app_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userid_mapping_supertokens_user_id_index" ON "supertokens_userid_mapping" USING btree ("app_id","supertokens_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "key_value_tenant_id_index" ON "supertokens_key_value" USING btree ("app_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "app_id_to_user_id_app_id_index" ON "supertokens_app_id_to_user_id" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "app_id_to_user_id_primary_user_id_index" ON "supertokens_app_id_to_user_id" USING btree ("primary_or_recipe_user_id","app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emailpassword_password_reset_token_expiry_index" ON "supertokens_emailpassword_pswd_reset_tokens" USING btree ("token_expiry");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emailpassword_pswd_reset_tokens_user_id_index" ON "supertokens_emailpassword_pswd_reset_tokens" USING btree ("app_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jwt_signing_keys_app_id_index" ON "supertokens_jwt_signing_keys" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dashboard_users_app_id_index" ON "supertokens_dashboard_users" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dashboard_user_sessions_expiry_index" ON "supertokens_dashboard_user_sessions" USING btree ("expiry");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dashboard_user_sessions_user_id_index" ON "supertokens_dashboard_user_sessions" USING btree ("app_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emailverification_tokens_index" ON "supertokens_emailverification_tokens" USING btree ("token_expiry");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emailverification_tokens_tenant_id_index" ON "supertokens_emailverification_tokens" USING btree ("app_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "thirdparty_users_email_index" ON "supertokens_thirdparty_users" USING btree ("app_id","email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "thirdparty_users_thirdparty_user_id_index" ON "supertokens_thirdparty_users" USING btree ("app_id","third_party_id","third_party_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passwordless_codes_created_at_index" ON "supertokens_passwordless_codes" USING btree ("app_id","tenant_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passwordless_codes_device_id_hash_index" ON "supertokens_passwordless_codes" USING btree ("app_id","tenant_id","device_id_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passwordless_devices_email_index" ON "supertokens_passwordless_devices" USING btree ("app_id","tenant_id","email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passwordless_devices_phone_number_index" ON "supertokens_passwordless_devices" USING btree ("app_id","tenant_id","phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passwordless_devices_tenant_id_index" ON "supertokens_passwordless_devices" USING btree ("app_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "totp_used_codes_expiry_time_ms_index" ON "supertokens_totp_used_codes" USING btree ("app_id","tenant_id","expiry_time_ms");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "totp_used_codes_tenant_id_index" ON "supertokens_totp_used_codes" USING btree ("app_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "totp_used_codes_user_id_index" ON "supertokens_totp_used_codes" USING btree ("app_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "all_auth_recipe_tenant_id_index" ON "supertokens_all_auth_recipe_users" USING btree ("app_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "all_auth_recipe_user_id_index" ON "supertokens_all_auth_recipe_users" USING btree ("app_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "all_auth_recipe_users_pagination_index1" ON "supertokens_all_auth_recipe_users" USING btree ("app_id","tenant_id","primary_or_recipe_user_time_joined" DESC NULLS FIRST,"primary_or_recipe_user_id" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "all_auth_recipe_users_pagination_index2" ON "supertokens_all_auth_recipe_users" USING btree ("app_id","tenant_id","primary_or_recipe_user_time_joined","primary_or_recipe_user_id" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "all_auth_recipe_users_pagination_index3" ON "supertokens_all_auth_recipe_users" USING btree ("recipe_id","app_id","tenant_id","primary_or_recipe_user_time_joined" DESC NULLS FIRST,"primary_or_recipe_user_id" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "all_auth_recipe_users_pagination_index4" ON "supertokens_all_auth_recipe_users" USING btree ("recipe_id","app_id","tenant_id","primary_or_recipe_user_time_joined","primary_or_recipe_user_id" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "all_auth_recipe_users_primary_user_id_index" ON "supertokens_all_auth_recipe_users" USING btree ("primary_or_recipe_user_id","app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "all_auth_recipe_users_recipe_id_index" ON "supertokens_all_auth_recipe_users" USING btree ("app_id","recipe_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "totp_user_devices_user_id_index" ON "supertokens_totp_user_devices" USING btree ("app_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_expiry_index" ON "supertokens_session_info" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_info_tenant_id_index" ON "supertokens_session_info" USING btree ("app_id","tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_thirdparty_provider_clients_third_party_id_index" ON "supertokens_tenant_thirdparty_provider_clients" USING btree ("connection_uri_domain","app_id","tenant_id","third_party_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_thirdparty_providers_tenant_id_index" ON "supertokens_tenant_thirdparty_providers" USING btree ("connection_uri_domain","app_id","tenant_id");
*/