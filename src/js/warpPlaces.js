
export const warpLocationDictionary = {
    'SlimedLake': {
        name: 'Slimed Lake',
        description: 'A pleasant lake full of life. It can get a bit slimy when it rains.',
        render: () => `
       <div class="SlimedLakeLocation relative flex items-center justify-center p-10 overflow-visible" 
             id="slime-lake" >
            
            <div class="relative w-80 h-80 group cursor-pointer">
                <div class="absolute inset-0 bg-blue-900/40 blur-xl animate-wobble-slow"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl animate-wobble overflow-hidden" style="box-shadow: inset 10px -20px 40px rgba(0,0,0,0.3);">
                    <div class="absolute inset-2 bg-white/10 animate-wobble-slow" style="border-radius: inherit;"></div>
                    <div class="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-t-2 border-blue-300/20 rounded-full animate-pulse"></div> 
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span class="text-blue-100 font-bold tracking-widest uppercase text-xs drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            Slimed Lake
                        </span>
                    </div>

                </div>
            </div>
            <br>
            <div class="items-center grid gap-4 justify-center m-5">
                <button class="base-button">Fish</button>
                <button class="base-button">Swim</button>
            </div>
        </div>
        `
    }
}