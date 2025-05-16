export function searchTag(selectedTag) {
    return `
        <div class="tag bg-customYellow rounded-lg font-manrope flex justify-evenly items-center p-4 gap-3">
            <p>${selectedTag}</p>
            <i class="fa-solid fa-xmark text-black cursor-pointer"></i>
        </div>
    `;
}