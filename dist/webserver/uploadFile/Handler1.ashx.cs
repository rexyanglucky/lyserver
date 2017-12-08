using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Collections;
using System.Text.RegularExpressions;
using System.Text;

namespace WebApplication1
{
    /// <summary>
    /// Handler1 的摘要说明
    /// </summary>
    public class Handler1 : IHttpHandler
    {
        public const string CONTENT_DISPOSITION = "Content-Disposition";
        public const string ENTER_STR = "Content-Disposition";
        public const string FILENAME = "filename";
        public const string FORMNAME = "name=";
        public const string NEWLINE = "\r\n\r\n";
        
        public static readonly byte[] Content_Disposition_Byte = System.Text.Encoding.UTF8.GetBytes(CONTENT_DISPOSITION);
        public static readonly byte[] NEWLINE_BYTE = System.Text.Encoding.UTF8.GetBytes(NEWLINE);

        public void ProcessRequest(HttpContext context)
        {
            var str = string.Empty;
            using (System.IO.Stream s = context.Request.GetBufferedInputStream())
            {
                FileStream fs = new FileStream(context.Server.MapPath("a1.txt"), FileMode.Append);
               
                //StreamWriter sw = new StreamWriter(fs, System.Text.Encoding.UTF8);
                //BinaryWriter bw = new BinaryWriter(fs, System.Text.Encoding.UTF8);
                byte[] source = new byte[s.Length];
                int size = 2048;
                byte[] b = new byte[size];
                ArrayList list = new ArrayList();

                int r = 0, k = 0;
                while ((r = s.Read(b, 0, b.Length)) > 0)
                {
                    Array.Copy(b, 0, source, k * size, r);
                    k++;
                }
                str = Encoding.UTF8.GetString(source);
                //var sourceByte = this.ResolveFile(context.Request, source);
                var sourceStr = this.ResolveFile(context.Request, str);
                File.WriteAllBytes(context.Server.MapPath("b"+DateTime.Now.ToFileTime()+".png"), sourceByte);
                //File.WriteAllText(context.Server.MapPath("c.txt"), str);
                File.WriteAllText(context.Server.MapPath("d.txt"), sourceStr);

                //var sourceByte = this.ResolveFile(context.Request, source);
                //var sourceByte = System.Text.Encoding.UTF8.GetBytes(str);
                //var sourceByte = System.Text.Encoding.UTF8.GetBytes(strsource);
                //File.WriteAllBytes(context.Server.MapPath("f1.txt"), source);
                //bw.Write(sourceByte, 0, sourceByte.Length);
                //File.WriteAllText(context.Server.MapPath("b.txt"), str);


                fs.Close();
            }

            context.Response.ContentType = "text/plain";

            context.Response.Write(str);
        }

        public string ResolveFile(HttpRequest req, string data)
        {

            var boundaryArr = req.Headers["content-type"].Split(';')[1].Split('=');
            var boundary = "--" + boundaryArr[1];
            //var formItemArr = data.Split(boundary.ToCharArray());
            var formItemArr = data.Split(new[] { boundary }, StringSplitOptions.None);
            var result = string.Empty;
            foreach (var item in formItemArr)
            {
                //var reg = new Regex("Content-Disposition: (form-data); name = \"(\\S+)\"(?:; (filename) = \"(\\S+[.]\\S{3,4})\"\\s + Content - Type: (\\S +))?", RegexOptions.IgnoreCase);
                var carr = item.Split(new[] { "\r\n\r\n" }, StringSplitOptions.None);
                if (carr.Length == 2 && carr[0].IndexOf("filename") > -1)
                {
                    result = carr[1];
                    break;
                }
                //var match = reg.Match(item);
            }
           
            return result;

        }
        public byte[] ResolveFile(HttpRequest req, byte[] data)
        {
            byte[] result = new byte[1];
            var boundaryArr = req.Headers["content-type"].Split(';')[1].Split('=');
            var boundary = "--" + boundaryArr[1];
            var boundaryByte = System.Text.Encoding.UTF8.GetBytes(boundary);
            var scanIndex = 0;
            while (scanIndex < data.Length)
            {
                //todo 循环
                var findIndex = data.IndexOfExt(boundaryByte, scanIndex);
                //查找到boundary
                if (findIndex > -1)
                {
                    //boundary 前已无内容要处理
                    if (findIndex - scanIndex == 0)
                    {
                        //查找当前 Content-Disposition
                        findIndex = data.IndexOfExt(Content_Disposition_Byte, scanIndex);
                        if (findIndex > -1)
                        {
                            var lineEnd = data.IndexOfExt(Encoding.UTF8.GetBytes("\r\n"), findIndex);
                            var line = Encoding.UTF8.GetString(data, findIndex, lineEnd - findIndex);

                            findIndex = lineEnd;
                            var findStrIndex = line.IndexOf(FORMNAME);
                            string formName = line.Substring(findStrIndex + FORMNAME.Length);
                            int end = formName.IndexOf(";");
                            if (end > -1)
                            {
                                formName = formName.Substring(0, end);
                            }
                            findIndex = data.IndexOfExt(NEWLINE_BYTE, findIndex);
                            var realDataEnd = data.IndexOfExt(boundaryByte, findIndex);
                            var realDataByte = new byte[realDataEnd - findIndex+ NEWLINE_BYTE.Length];
                            Array.Copy(data, findIndex + NEWLINE_BYTE.Length, realDataByte, 0, realDataByte.Length);
                            findIndex = realDataEnd;
                            result = realDataByte;
                            if (line.IndexOf(FILENAME) > -1)
                            {
                                //todo content-type
                                //findIndex = data.IndexOfExt(Encoding.UTF8.GetBytes("\r\n\r\n"), findIndex);
                                //var binaryEnd = data.IndexOfExt(Content_Disposition_Byte, findIndex);

                                //var binaryByte = new byte[binaryEnd - findIndex];
                                //Array.Copy(data, findIndex, binaryByte, 0, binaryByte.Length);
                                //result = binaryByte;
                                break;

                            }
                            else
                            {
                       
                            }
                        }
                    }
                    //boundary 前还有内容，需要追加到上一个表单数据中
                    else
                    {

                    }
                }
                //未查找到boundary 说明该数据块儿属于上一个表单数据
                else
                {

                }
                scanIndex= findIndex;
            }
            return result;

        }
        public static int ByteIndexOf(byte[] searched, byte[] find, int start)
        {
            bool matched = false;
            int end = find.Length - 1;
            int skip = 0;
            for (int index = start; index <= searched.Length - find.Length; ++index)
            {
                matched = true;
                if (find[0] != searched[index] || find[end] != searched[index + end]) continue;
                else skip++;
                if (end > 10)
                    if (find[skip] != searched[index + skip] || find[end - skip] != searched[index + end - skip])
                        continue;
                    else skip++;
                for (int subIndex = skip; subIndex < find.Length - skip; ++subIndex)
                {
                    if (find[subIndex] != searched[index + subIndex])
                    {
                        matched = false;
                        break;
                    }
                }
                if (matched)
                {
                    return index;
                }
            }
            return -1;
        }



        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    public static class Exten
    {
        public static int IndexOfExt(this byte[] source, byte[] find, int start)
        {
            var isMatch = false;
            var end = find.Length - 1;
            //var skip = 0;
            var index = -1;
            for (int k = start; k < source.Length - find.Length; k++)
            {
                isMatch = true;
                if (find[0] != source[k] || find[end] != source[k + end])
                {
                    continue;
                }
                else
                {
                    //skip++;
                    for (int m = 1; m < find.Length - 1; m++)
                    {
                        if (find[m] != source[k + m ] || find[end - m] != source[k  + end - m])
                        {
                            isMatch = false;
                            break;
                        }
                    }
                }
                if (isMatch)
                {
                    index = k;
                    break;
                }

            }
            return index;
        }
    }
}