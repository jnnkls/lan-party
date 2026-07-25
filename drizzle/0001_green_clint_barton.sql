CREATE TABLE "oauth_account" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"provider" varchar(60) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "oauth_account_provider_provider_account_id_unique" UNIQUE("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "player_game" (
	"player_id" varchar(255) NOT NULL,
	"game_id" varchar(255) NOT NULL,
	"platform" varchar(120),
	"notes" varchar(255),
	CONSTRAINT "player_game_player_id_game_id_pk" PRIMARY KEY("player_id","game_id")
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth_account" ADD CONSTRAINT "oauth_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_game" ADD CONSTRAINT "player_game_player_id_player_profile_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_game" ADD CONSTRAINT "player_game_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;