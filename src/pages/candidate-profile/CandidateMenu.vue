<template>
  <div class="candidateProfile-menu">
    <v-row>
      <v-card flat class="navDrawer center my-10 ml-3">
        <v-navigation-drawer permanent expand-on-hover dark color="orange darken-2">
          <v-list nav>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-android-messages</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Messages</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-bell-ring</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Notifications</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-heart</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Favourites</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-cog-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-card>
    </v-row>
  </div>
</template>





