using Azure.Storage.Blobs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace NewPharmacy.Helper
{
    public static class FileHelper
    { 
        public static async Task<string> UploadImageAsync(byte[] imageBytes, string fileName)
        {
            // Testiraj lokalno čuvanje slike
            try
            {
                var path = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", fileName);
                await File.WriteAllBytesAsync(path, imageBytes);
                return path; // Vraća lokalni put
            }
            catch (Exception ex)
            {
                throw new Exception("Greška pri čuvanju slike.", ex);
            }
        }



    }
}
