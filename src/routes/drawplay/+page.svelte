<script>
    import PlayDrawing from '$lib/components/PlayDrawing.svelte';

    let savedPlayData = null;
</script>

<h1>Play Drawing</h1>

<PlayDrawing width={800} height={600} editable={true} playData={savedPlayData} />