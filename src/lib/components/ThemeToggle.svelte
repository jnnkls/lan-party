<script lang="ts">
  import { onMount } from 'svelte';
  import { applyTheme, getInitialTheme, toggleTheme, type Theme } from '$lib/theme';

  let theme: Theme = 'light';
  onMount(() => {
    theme = getInitialTheme();
    applyTheme(theme);
  });

  function handleToggle() {
    theme = toggleTheme();
  }
</script>

<button
  class="fixed bottom-4 right-4 z-50 rounded-full bg-white/90 p-3 shadow ring-1 ring-slate-300 backdrop-blur transition hover:bg-amber-50 dark:bg-slate-800/90 dark:text-slate-200 dark:ring-slate-600"
  on:click={handleToggle}
  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {#if theme === 'dark'}
    <i class="fa-solid fa-sun text-amber-400"></i>
  {:else}
    <i class="fa-solid fa-moon text-slate-700"></i>
  {/if}
</button>
