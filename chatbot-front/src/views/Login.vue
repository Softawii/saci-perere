<script setup>
import AccountIcon from '../components/icons/Account.vue';
import LockIcon from '../components/icons/Lock.vue';
import EyeIcon from '../components/icons/Eye.vue';
import EyeOffIcon from '../components/icons/EyeOff.vue';
</script>
<template>
  <div id="main" style="min-height: 100vh; display: flex; align-items: center;">
    <i-container>
      <i-row center style="">
        <h1 style="margin: 0 0 80px">
          SAMA
        </h1>
      </i-row>
      <i-row center style="">
        <i-form v-model="form">
          <i-form-group>
            <i-input name="username" placeholder="Usuário">
              <template #prefix>
                <AccountIcon />
              </template>
            </i-input>
            <i-form-error for="username" />
          </i-form-group>

          <i-form-group>
            <i-input name="password" placeholder="Senha">
              <template #prefix>
                <LockIcon />
              </template>
              <template v-if="isPasswordVisible" #suffix>
                <EyeIcon @click="isPasswordVisible = !isPasswordVisible" />
              </template>
              <template v-else #suffix>
                <EyeOffIcon @click="isPasswordVisible = !isPasswordVisible" />
              </template>
            </i-input>
            <i-form-error for="password" />
          </i-form-group>

          <i-form-group class="_margin-x:auto" style="max-width: 200px;">
            <i-button id="sign-in" outline color="primary">
              Entrar
            </i-button>
          </i-form-group>
        </i-form>
      </i-row>
    </i-container>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    const formSchema = {
      username: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
      password: {
        validators: [
          {
            name: 'required',
          },
          {
            name: 'minLength',
            value: 8,
          },
          {
            name: 'custom', // lowercase
            message: 'Please enter at least one lowercase character.',
            validator: v => /[a-z]/.test(v),
          },
          {
            name: 'custom', // uppercase
            message: 'Please enter at least one uppercase character.',
            validator: v => /[A-Z]/.test(v),
          },
          {
            name: 'custom', // numeric
            message: 'Please enter at least one numeric character.',
            validator: v => /[0-9]/.test(v),
          },
          {
            name: 'custom', // symbol
            message: 'Please enter at least one symbol.',
            validator: v => /[^a-zA-Z0-9]/.test(v),
          },
        ],
      },
    };
    return {
      isPasswordVisible: false,
      form: this.$inkline.form(formSchema),
    };
  },
};
</script>

<style lang="scss" scoped>
#main {
  color: white;
  background-color: #023E8A;
}

#sign-in {
  border-width: 2px;
  border-color: white;
  width: 200px;
  color: white;
}
</style>
