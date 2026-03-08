let allIssues = [];

// 1
const loadData = async (searchText = '') => {
    const loader = document.getElementById('loader');
    const container = document.getElementById('issueContainer');
    
    if (loader) loader.classList.remove('hidden');
    if (container) container.innerHTML = '';
    
    // 2
    const url = searchText 
        ? `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`
        : `https://phi-lab-server.vercel.app/api/v1/lab/issues`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        allIssues = data.data || [];
        displayData(allIssues);
    } catch (err) {
        console.error("ডেটা লোড করতে সমস্যা:", err);
    } finally {
        if (loader) loader.classList.add('hidden');
    }
};

//3
const displayData = (data) => {
    const container = document.getElementById('issueContainer');
    const issueCountElement = document.getElementById('issueCount');
    
    if (!container) return;
    container.innerHTML = '';
    if (issueCountElement) issueCountElement.innerText = data.length;

    data.forEach(issue => {
        const status = issue.status || 'open';
        const priority = issue.priority || 'Low';
        const title = issue.title || 'No Title';
        const description = issue.description || 'No description available.';
        const author = issue.author ? issue.author.split(' ')[0] : 'Unknown';
        const issueId = issue.id ? String(issue.id).slice(0, 6) : '0';

        
        const borderClass = status === 'open' ? 'border-t-[#10B981]' : 'border-t-[#8B5CF6]';
        
        // 4
        let priorityStyle = "bg-gray-100 text-gray-500";
        if(priority.toLowerCase() === 'high') priorityStyle = "bg-[#FEE2E2] text-[#EF4444]";
        else if(priority.toLowerCase() === 'medium') priorityStyle = "bg-[#FEF3C7] text-[#F59E0B]";

        const card = document.createElement('div');
        card.className = `bg-white shadow-sm rounded-2xl border border-gray-100 border-t-[6px] ${borderClass} p-6 flex flex-col h-full hover:shadow-md transition-all cursor-pointer`;
        
        card.onclick = () => showDetails(issue.id);
        
        card.innerHTML = `
            <div class="flex justify-between items-center mb-5">
                <div class="w-9 h-9 flex items-center justify-center">
                    <img src="${status === 'open' ? 'assets/Open-Status.png' : 'assets/Closed- Status .png'}" 
                         alt="Icon" class="w-full h-full object-contain">
                </div>
                <span class="px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${priorityStyle}">${priority}</span>
            </div>

            <h3 class="font-bold text-[#1F2937] text-lg mb-3 leading-snug">${title}</h3>
            <p class="text-gray-400 text-sm mb-6 line-clamp-2 h-10">${description}</p>

            <div class="flex flex-wrap gap-2 mb-8">
                <span class="bg-[#FEE2E2] text-[#EF4444] px-3 py-1 rounded-md text-[10px] font-bold border border-red-500/10 italic flex items-center gap-1">● BUG</span>
                <span class="bg-[#FEF3C7] text-[#F59E0B] px-3 py-1 rounded-md text-[10px] font-bold border border-orange-500/10 italic flex items-center gap-1">● HELP WANTED</span>
            </div>

            <div class="border-t border-gray-50 pt-4 mt-auto">
                <p class="text-xs text-gray-500 font-semibold mb-1">#${issueId} by ${author}</p>
                <p class="text-xs text-gray-300">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
        `;
        container.appendChild(card);
    });
};

// 5
const showDetails = async (id) => {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        const issue = data.data;

        const modalBody = document.getElementById('modalContent');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="p-10 md:p-14">
                    <h2 class="text-3xl font-extrabold text-[#1F2937] mb-5">${issue.title}</h2>
                    
                    <div class="flex flex-wrap items-center gap-4 mb-8">
                        <span class="px-4 py-1.5 bg-[#10B981] text-white rounded-full font-bold text-xs">
                            Opened
                        </span>
                        <span class="text-gray-300">•</span>
                        <span class="text-gray-500 font-medium text-sm">Opened by <span class="text-gray-800 font-bold">${issue.author}</span></span>
                        <span class="text-gray-300">•</span>
                        <span class="text-gray-500 font-medium text-sm">${new Date(issue.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>

                    <div class="flex gap-3 mb-10">
                        <span class="bg-[#FEE2E2] text-[#EF4444] px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 italic uppercase">● BUG</span>
                        <span class="bg-[#FEF3C7] text-[#F59E0B] px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-100 italic uppercase">● HELP WANTED</span>
                    </div>

                    <p class="text-[#4B5563] text-lg leading-relaxed mb-12">
                        ${issue.description}
                    </p>

                    <div class="bg-[#F9FAFB] rounded-3xl p-8 flex justify-between items-center border border-gray-100 mb-10">
                        <div>
                            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Assignee:</p>
                            <p class="font-extrabold text-[#111827] text-2xl">${issue.author}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 text-left">Priority:</p>
                            <span class="px-6 py-2 bg-[#EF4444] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-100">
                                ${issue.priority.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button onclick="issueModal.close()" class="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-100">
                            Close
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('issueModal').showModal();
        }
    } catch (e) {
        console.error("মডাল লোড এরর:", e);
    }
};

//6
const handleSearch = () => {
    const text = document.getElementById('searchInput').value;
    loadData(text);
};

const filterData = (status, btn) => {
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-transparent', 'text-gray-600');
    });
    btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
    btn.classList.remove('bg-transparent', 'text-gray-600');

    if (status === 'all') displayData(allIssues);
    else displayData(allIssues.filter(i => i.status === status));
};

// 7
loadData();