import { Download, Trash2 } from "lucide-react"
import { filesApi } from "../../apis/files"

const FileItem = ({ file, onDownload, onDelete, selectable, checked, onCheck }) => {
  return (
    <div className='flex items-center gap-3 p-3 rounded-lg border border-gray-200
        bg-white hover:bg-gray-50 transition-colors'>
        {/* 체크 박스 */}
        {selectable && (
            <input 
                type="checkbox"
                className='w-4 h-4 accemt-blue-500 cursor-pointer flex-shrink-0'
                onChange={(e) => onCheck?.(file.id, e.target.checked)}
            />
        )}
    
        {/* 썸네일 */}
        <div className='w-16 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-100'>
            <img 
                src={`/api/files/img/${file.id}`}
                alt={filesApi.originName}
                className='w-full h-full object-cover'
                onError={(e) => {
                    e.target.style.display = 'none'
                }}
            />
        </div>

        {/* 파일 정보 */}
        <div className='flex-1 min-w-0 flex items-center gap-2'>
            <p className='text-sm font-medium text-gray-800 truncate'>
                {file.originName}
            </p>
            <p className='text-xs text-gray-400 mt-0 5'>
                {file.fileSize}
                {file.type == 'MAIN' && (
                    <span className='ml-2 inline-block px-1.5 p-0.5 text-xs bg-blue-500 text-white rounded'>
                        대표
                    </span>
                )}
            </p>
        </div>

        {/* 버튼 */}
        <div className='flex items-center gap-1 flex-shrink-0'>
            <button
                type='button'
                className='p-1.5 rounded text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors'
                title='다운로드'
                onClick={() => onDownload(file.id, file.originName)}
            >
                <Download size={16}/>
            </button>
            <button
                type='button'
                className='p-1.5 rounded text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors'
                title='삭제'
                onClick={() => onDelete(file.id)}
            >
                <Trash2 size={16}/>
            </button>
        </div>
    </div>
  )
}

export default FileItem