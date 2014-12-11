using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Diagnostics;
using System.IO;

namespace Scholar
{
	/// <summary>
	/// Summary description for Scholar
	/// </summary>
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.Web.Script.Services.ScriptService]
	public class Scholar : System.Web.Services.WebService
	{

		[WebMethod]
		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public string QueryGoogleScholar(string author, string phrase)
		{
			ProcessStartInfo start = new ProcessStartInfo();
			start.FileName = @"C:\Python27\python.exe";
			string cmd = @"D:\RefApp\scholar.py -c 5 --author """ + author + @""" --phrase """ + phrase + @""" --citation en";
			string args = "";
			string result = "";
			start.Arguments = string.Format("{0} {1}", cmd, args);
			start.UseShellExecute = false;
			start.RedirectStandardOutput = true;
			using (Process process = Process.Start(start))
			{
				using (StreamReader reader = process.StandardOutput)
				{
					result = reader.ReadToEnd();
				}
			}

			EndnoteParser parser = new EndnoteParser();
			List<RefData> refData = parser.Parse(result);

			return new JavaScriptSerializer().Serialize(refData);
		}
	}
}
