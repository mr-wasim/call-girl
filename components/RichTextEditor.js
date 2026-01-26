// components/RichTextEditor.js
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function RichTextEditor({ value, onChange }) {
  return (
    <div className="">
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder="Write description..."
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ],
        }}
        formats={[
          'header',
          'bold', 'italic', 'underline',
          'list', 'bullet',
        ]}
        className="bg-white w-full"
      />

      {/* Extra fix for quill internal width */}
      <style jsx global>{`
        .ql-container {
          width: 100%;
        }
        .ql-editor {
          min-height: 180px;
        }
      `}</style>
    </div>
  )
}
