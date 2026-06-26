<svelte:options
	customElement={{
		tag: 'lang-chk',
		shadow: 'none',
		props: {
			lang: { type: 'Object', reflect: true },
			view: { type: 'String', reflect: true },
		},
	}}
/>

<script lang="ts">
	import { initLangStore, langStore, toggleLang } from '@/stores/langStore';
	import type { SupportedLanguages } from '@/types/common/locale';
	import type { PagePropsInput } from '@/types/page/page.type';
	import { LANGS } from '@/types/lang/LangTranslate.type';
	import { untrack } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	export const createChkLang = () => ({
		ko: true,
		en: true,
		zh: false,
		ja: false,
		th: false,
		vi: false,
	});

	export interface Props {
		lang?: SupportedLanguages;
		view?: PagePropsInput['view'];
	}

	let { lang = $bindable(createChkLang()), view = 'reg' }: Props = $props();

	$effect(() => {
		const snap = $state.snapshot(lang);

		untrack(() => {
			initLangStore({
				zh: snap.zh,
				ja: snap.ja,
				th: snap.th,
				vi: snap.vi,
			});
		});
	});
</script>

{#if lang}
	{#if view === 'detail'}
		<div class="flex flex-wrap items-center gap-5">
			{#each LANGS as item}
				{#if item.key === 'ko' || item.key === 'en'}
					<ui-txt txt={item.label} size="sm" class="flex-none" cls="text-black"></ui-txt>
				{:else if $langStore.lang[item.key]}
					<ui-txt txt={item.label} size="sm" class="flex-none" cls="text-black"></ui-txt>
				{/if}
			{/each}
		</div>
	{:else if view === 'reg' || view === 'edit'}
		<div class="flex flex-wrap items-center justify-end gap-5">
			{#each LANGS as item}
				{#if item.key === 'ko' || item.key === 'en'}
					<ui-txt txt={item.label} class="flex-none"></ui-txt>
				{:else}
					<ui-checkbox
						item-id={`lang-chk-${uuidv4()}`}
						txt={item.label}
						class="flex-none"
						checked={$langStore.lang[item.key]}
						change={(e: Event) => {
							const input = e.currentTarget as HTMLInputElement;
							lang[item.key] = input.checked;
							toggleLang(item.key);
						}}
					></ui-checkbox>
				{/if}
			{/each}
		</div>
	{/if}
{/if}
