using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Scholar
{
	public class RefData
	{
		public string Type;
		public string Title;
		public string Journal;
		public List<string> Author;
		public string Volume;
		public string Issue;
		public string Pages;
		public string Year;
		public string Publisher;

		public RefData()
		{
			Author = new List<string>();
		}
		public RefData MakeArticle(string title,
			string journal, string volume, string issue, string pages, string year, string publisher)
		{
			RefData data = new RefData();
			data.Type = "Article";
			data.Title = title;
			data.Journal = journal;
			data.Volume = volume;
			data.Issue = issue;
			data.Pages = pages;
			data.Year = year;
			data.Publisher = publisher;
			return data;
		}
	}
}