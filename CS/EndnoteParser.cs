using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Scholar
{
	public class EndnoteParser
	{
		public List<RefData> Parse(string input)
		{
			List<RefData> listData = new List<RefData>();
			RefData curData = null;
			string[] lines = input.Split('\n');
			for (int i = 0; i < lines.Length; i++)
			{
				lines[i] = lines[i].Trim();
				if (lines[i].Length < 3)
					continue;
				if (lines[i][0] != '%' && lines[i][2] != ' ')
				{
					// Exception
					return listData;
				}
				switch (lines[i][1])
				{
					case '0':
						if (curData != null)
							listData.Add(curData);
						curData = new RefData();
						break;
					case 'T':
						curData.Title = lines[i].Substring(3);
						break;
					case 'A':
						curData.Author.Add(lines[i].Substring(3));
						break;
					case 'J':
						curData.Journal = lines[i].Substring(3);
						break;
					case 'V':
						curData.Volume = lines[i].Substring(3);
						break;
					case 'N':
						curData.Issue = lines[i].Substring(3);
						break;
					case 'P':
						curData.Pages = lines[i].Substring(3);
						break;
					case 'D':
						curData.Year = lines[i].Substring(3);
						break;
					case 'I':
						curData.Publisher= lines[i].Substring(3);
						break;
				}

			}
			if (curData != null)
				listData.Add(curData);
			return listData;
		}
	}
}