CREATE TYPE "public"."lan_status" AS ENUM('expired', 'ongoing', 'future');--> statement-breakpoint
CREATE TYPE "public"."rarity" AS ENUM('common', 'rare', 'epic', 'legendary');--> statement-breakpoint
CREATE TABLE "achievement" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"title_reward_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "console" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(160) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(160) NOT NULL,
	"platform" varchar(120)
);
--> statement-breakpoint
CREATE TABLE "lan_attendance" (
	"lan_id" varchar(255) NOT NULL,
	"player_id" varchar(255) NOT NULL,
	"joined_at" timestamp NOT NULL,
	"checked_in" boolean DEFAULT false NOT NULL,
	"xp_awarded" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "lan_attendance_lan_id_player_id_pk" PRIMARY KEY("lan_id","player_id")
);
--> statement-breakpoint
CREATE TABLE "lan_console" (
	"lan_id" varchar(255) NOT NULL,
	"console_id" varchar(255) NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "lan_console_lan_id_console_id_pk" PRIMARY KEY("lan_id","console_id")
);
--> statement-breakpoint
CREATE TABLE "lan_game" (
	"lan_id" varchar(255) NOT NULL,
	"game_id" varchar(255) NOT NULL,
	CONSTRAINT "lan_game_lan_id_game_id_pk" PRIMARY KEY("lan_id","game_id")
);
--> statement-breakpoint
CREATE TABLE "lan_party" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text,
	"theme" varchar(120),
	"location" varchar(160),
	"cover_image" varchar(512),
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp,
	"status" "lan_status" DEFAULT 'future' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_achievement" (
	"player_id" varchar(255) NOT NULL,
	"achievement_id" varchar(255) NOT NULL,
	"earned_at" timestamp NOT NULL,
	CONSTRAINT "player_achievement_player_id_achievement_id_pk" PRIMARY KEY("player_id","achievement_id")
);
--> statement-breakpoint
CREATE TABLE "player_gear" (
	"player_id" varchar(255) NOT NULL,
	"console_id" varchar(255) NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "player_gear_player_id_console_id_pk" PRIMARY KEY("player_id","console_id")
);
--> statement-breakpoint
CREATE TABLE "player_profile" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"username" varchar(32) NOT NULL,
	"avatar_url" varchar(512),
	"active_title" varchar(120),
	"rarity" "rarity" DEFAULT 'common' NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_title" (
	"player_id" varchar(255) NOT NULL,
	"title_id" varchar(255) NOT NULL,
	"earned_at" timestamp NOT NULL,
	CONSTRAINT "player_title_player_id_title_id_pk" PRIMARY KEY("player_id","title_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "tenant_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "title" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(120) NOT NULL,
	"source" varchar(160)
);
--> statement-breakpoint
CREATE TABLE "tournament" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"lan_id" varchar(255) NOT NULL,
	"game_id" varchar(255) NOT NULL,
	"name" varchar(160) NOT NULL,
	"starts_at" timestamp,
	"winner_player_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "tournament_match" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tournament_id" varchar(255) NOT NULL,
	"round" integer NOT NULL,
	"player_a_id" varchar(255),
	"player_b_id" varchar(255),
	"winner_player_id" varchar(255),
	"score" varchar(40)
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255),
	"age" integer,
	"username" varchar(32) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_title_reward_id_title_id_fk" FOREIGN KEY ("title_reward_id") REFERENCES "public"."title"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "console" ADD CONSTRAINT "console_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lan_attendance" ADD CONSTRAINT "lan_attendance_lan_id_lan_party_id_fk" FOREIGN KEY ("lan_id") REFERENCES "public"."lan_party"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lan_attendance" ADD CONSTRAINT "lan_attendance_player_id_player_profile_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lan_console" ADD CONSTRAINT "lan_console_lan_id_lan_party_id_fk" FOREIGN KEY ("lan_id") REFERENCES "public"."lan_party"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lan_console" ADD CONSTRAINT "lan_console_console_id_console_id_fk" FOREIGN KEY ("console_id") REFERENCES "public"."console"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lan_game" ADD CONSTRAINT "lan_game_lan_id_lan_party_id_fk" FOREIGN KEY ("lan_id") REFERENCES "public"."lan_party"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lan_game" ADD CONSTRAINT "lan_game_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lan_party" ADD CONSTRAINT "lan_party_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_achievement" ADD CONSTRAINT "player_achievement_player_id_player_profile_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_achievement" ADD CONSTRAINT "player_achievement_achievement_id_achievement_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievement"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_gear" ADD CONSTRAINT "player_gear_player_id_player_profile_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_gear" ADD CONSTRAINT "player_gear_console_id_console_id_fk" FOREIGN KEY ("console_id") REFERENCES "public"."console"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_profile" ADD CONSTRAINT "player_profile_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_profile" ADD CONSTRAINT "player_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_title" ADD CONSTRAINT "player_title_player_id_player_profile_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_title" ADD CONSTRAINT "player_title_title_id_title_id_fk" FOREIGN KEY ("title_id") REFERENCES "public"."title"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "title" ADD CONSTRAINT "title_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament" ADD CONSTRAINT "tournament_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament" ADD CONSTRAINT "tournament_lan_id_lan_party_id_fk" FOREIGN KEY ("lan_id") REFERENCES "public"."lan_party"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament" ADD CONSTRAINT "tournament_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament" ADD CONSTRAINT "tournament_winner_player_id_player_profile_id_fk" FOREIGN KEY ("winner_player_id") REFERENCES "public"."player_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_match" ADD CONSTRAINT "tournament_match_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_match" ADD CONSTRAINT "tournament_match_player_a_id_player_profile_id_fk" FOREIGN KEY ("player_a_id") REFERENCES "public"."player_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_match" ADD CONSTRAINT "tournament_match_player_b_id_player_profile_id_fk" FOREIGN KEY ("player_b_id") REFERENCES "public"."player_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_match" ADD CONSTRAINT "tournament_match_winner_player_id_player_profile_id_fk" FOREIGN KEY ("winner_player_id") REFERENCES "public"."player_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;