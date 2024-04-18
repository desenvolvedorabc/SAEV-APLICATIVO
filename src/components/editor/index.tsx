import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import 'node_modules/react-quill/dist/quill.snow.css'
import { EditorStyled } from './styledComponents'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'color': [] }, { 'background': [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

export function Editor({changeText, initialValue = "", minHeight}) {
  const [value, setValue] = useState(initialValue)

  const handleChangeValue = (changed) => {
    setValue(changed)
    changeText(changed)
  }
  useEffect(() => {
    handleChangeValue(initialValue)
    console.log('initialValue :', initialValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue])

  return <EditorStyled minHeight={minHeight}>
          <QuillNoSSRWrapper 
            modules={modules} formats={formats} preserveWhitespace theme="snow" onChange={handleChangeValue} value={value} />
          </EditorStyled>
}